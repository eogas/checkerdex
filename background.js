
var maxOut = 10;
var baseScore = 1;
var range = 24;
var rangeMS = range * 60 * 60 * 1000;

// Called when the url of a tab changes.
function checkForValidUrl(tabId, changeInfo, tab) {
	if (changeInfo.status != "loading") return;

	var domains = localStorage["domains"];
	if (!domains) return;

	domains = JSON.parse(domains);
	for (var i = 0; i < domains.length; i++)
	{
		if (tab.url.indexOf(domains[i]) > -1) {
			var dates = localStorage[domains[i]];
			if (!dates) dates = [];
			else dates = JSON.parse(dates);

			var now = new Date();
			now = Date.UTC(now.getYear(), now.getMonth(), now.getDay(), now.getHours(),
				now.getMinutes(), now.getSeconds(), now.getMilliseconds());
			dates.push(now);

			for (var j = 0; j < dates.length - 1; j++)
			{
				var diff = now - dates[j];
				if (diff > rangeMS)
				{
					// remove date if not in range
					dates.splice(j, 1);
					j--;
					continue;
				}
			}

			localStorage[domains[i]] = JSON.stringify(dates);

			var cd = checkerdex(dates).toFixed(2);

			var icon, msg;
			if (cd > maxOut) // off the scale
			{
				icon = 'bad.png';
				msg = 'Off the checkerdex scale! For shame.';
			} else if (cd > (maxOut * .8)) //bad
			{
				icon = 'bad.png';
				msg = cd + ' out of ' + maxOut + ', go do some work!';
			} else if (cd > (maxOut * .5)) //okay
			{
				icon = 'okay.png';
				msg = cd + ' out of ' + maxOut + ', doing okay.';
			} else // good
			{
				icon = 'good.png';
				msg = cd + ' out of ' + maxOut + ', looking good!';
			}

			chrome.pageAction.setIcon({tabId: tabId, path: icon});
			chrome.pageAction.setTitle({tabId: tabId, title: msg});
			chrome.pageAction.show(tabId);

			break;
		}
	}
};

// Calculate heckerdex for the current domain, dates is the list of
// dates when this domain has been visited
function checkerdex(dates)
{
	var sum = 0;

	var now = dates[dates.length - 1];
	for (var i = 0; i < dates.length; i++)
	{
		var weight = (rangeMS - (now - dates[i])) / rangeMS;
		sum += weight * baseScore;
	}

	return sum;
}

// Listen for any changes to the URL of any tab.
chrome.tabs.onUpdated.addListener(checkForValidUrl);