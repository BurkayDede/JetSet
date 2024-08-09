// AJAX-Anfrage, um das Template zu laden
fetch('/div_templates/menu_div.html')
    .then(response => response.text())
    .then(data => {
    document.getElementById('template-container').innerHTML = data;
});