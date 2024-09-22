/*
*   Fonction de récupération des information de formulaire.
*   @ form      => élément HTML de formulaire
*
*   @ return    => un objet FormData
*/
export function form_data(form) {
    var formData = new FormData();

    for (var i = 0; i < form.length; i++) {
        var element = form[i];
        if (element.type !== 'submit') {
            if (element.type === 'file') {
                for (var j = 0; j < element.files.length; j++) {
                    formData.append(element.name, element.files[j]);
                }
            } else if (element.type === 'checkbox' || element.type === 'radio') {
                if (element.checked) {
                    formData.append(element.name, element.value);
                }
            } else {
                formData.append(element.name, element.value);
            }
        }
    }

    return formData;
}