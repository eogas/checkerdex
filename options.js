function add_domain()
{
  var field = document.getElementById("domainInput");
  var domain = field.value;

  if (domain == '') return;

  // TODO: add in actual domain validation

  var select = document.getElementById("domains");
  for (var i = 0; i < select.children.length; i++) {
    if (domain == select.children[i].text) {
      alert(domain + " is already being watched");
      return;
    }
  }

  var option = document.createElement("option");
  option.text = domain;

  select.appendChild(option);
  save_options();
}

function remove_selected()
{
  var select = document.getElementById("domains");

  for (var i = 0; i < select.children.length; i++) {
    var option = select.children[i];
    if (option.selected)
    {
	  	delete localStorage[option.text];
    	select.removeChild(option);
    }
  }

  save_options();
}


function clear_all()
{
  if (!confirm("Really clear all domains?")) return;

  var select = document.getElementById("domains");

  for (var i = 0; i < select.children.length; i++) {
  	delete localStorage[select.children[i].text];
    select.removeChild(select.children[i]);
  }

  save_options();
}

// Saves options to localStorage.
function save_options() {
  console.log("save");
  var domains = [];

  var select = document.getElementById("domains");
  for (var i = 0; i < select.children.length; i++) {
    domains.push(select.children[i].text);
  }

  localStorage["domains"] = JSON.stringify(domains);
}

// Restores select box state to saved value from localStorage.
function restore_options() {
  console.log("restore");
  var domains = localStorage["domains"];

  if (!domains) {
    return;
  }

  domains = JSON.parse(domains);

  var select = document.getElementById("domains");
  for (var i = 0; i < domains.length; i++) {
    var option = document.createElement("option");
    option.text = domains[i];

    select.appendChild(option);
  }
}

restore_options();
document.querySelector('#add').addEventListener('click', add_domain);
document.querySelector('#clear').addEventListener('click', clear_all);
document.querySelector('#remove').addEventListener('click', remove_selected);