$(document).ready(() => {
    //Initialize DataTable
    $('weaponTable').DataTable();
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyDSReJwmQq28UekDmCjN2jAzPx8OPTtOnw",
        authDomain: "rpgloot-9cf84.firebaseapp.com",
        databaseURL: "https://rpgloot-9cf84.firebaseio.com",
        projectId: "rpgloot-9cf84",
        storageBucket: "rpgloot-9cf84.appspot.com",
        messagingSenderId: "339670010665"
    };
    firebase.initializeApp(config);
    let database = firebase.database();

    //Add Weapon button
    $('#weaponSubmit').on('click', () => {
        event.preventDefault();
        let weapon = {};
        let data = $('#weaponForm').serializeArray();
        data.map(keyValuePair => {
            weapon[keyValuePair.name] = keyValuePair.value;
        });
        database.ref('/weapons').push(weapon);
    });

    //Add Armor Button
    $('#armorSubmit').on('click', () => {
        event.preventDefault();
        let armor = {};
        let data = $('#armorForm').serializeArray();
        data.map(keyValuePair => {
            armor[keyValuePair.name] = keyValuePair.value;
        });
        database.ref('/armor').push(armor);
    });

    //Data watcher to buid data table
    database.ref('/weapons').on('value', snapshot => {
        $('#weaponsTable tbody tr').remove();
        snapshot.forEach((child) => {
            let currentWeapon = child.val();
            let newTableRow = createNewRowWithDeleteBtn(child.key, snapshot.key);
            let headers = [];
            let columns = $('#weaponsTable thead tr th').each(function() { headers.push( $(this).attr('data-value') ) });
            
            headers.map(header => {
                if (header) {
                    let rowData = $('<td>').text(currentWeapon[header]);
                    newTableRow.append(rowData); 
                }
            });
             
            $('tbody').append(newTableRow);                
        });
    });

    database.ref('/armor').on('value', snapshot => {
        $('#armorTable tbody tr').remove();
        snapshot.forEach((child) => {
            let currentArmor = child.val();
            let newTableRow = createNewRowWithDeleteBtn(child.key, snapshot.key);
            let headers = [];
            let columns = $('#armorTable thead tr th').each(function() { headers.push( $(this).attr('data-value') ) });
            
            headers.map(header => {
                if (header) {
                    let rowData = $('<td>').text(currentArmor[header]);
                    newTableRow.append(rowData); 
                }
            });
             
            $('tbody').append(newTableRow);                
        });
    });

    //Generic Delete Button Event Listener
    $('table').on('click', 'button', (event) => {
        let targetId = event.target.dataset.id;
        let category = event.target.dataset.category;
        database.ref(`/${category}/${targetId}`).remove();
    });

    //Generic create delete button for table row.
    let createNewRowWithDeleteBtn = (key, category) => {
        let tableRow = $('<tr>');

        //Create and append delete button to new row
        let deleteButton = $('<button>X</button>');
            deleteButton.addClass('btn btn-danger');
            deleteButton.attr('data-id', key);
            deleteButton.attr('data-category', category)
            tableRow.append(deleteButton); 

        return tableRow;
    }    
});