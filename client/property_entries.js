

/**
  * PropertyEntries keeps track of the currently displayed properties. It produces the HTML code 
  * for feeding the properties table in the inspector. This allows to easily modify the form of a
  * property table entry. 
  */
function PropertyEntries(tableID){
    this.entries      = [];
    this.properties   = [];
    this.tableID      = '#' + tableID;
    this.currEditable = -1;
};


/*
 * Resets the property table: remove old content, fill with new. 
 */
PropertyEntries.prototype.reset = function(properties){
    this.entries = [];
    this.properties = properties;
    
    for (i in properties){
        this.createNewEntry(i)
    }
}


/*
 * Creates HTML code for a property entry. Saves it in array. 
 * --> first create empty entry, then fill it with this.setEntry.
 */
PropertyEntries.prototype.createNewEntry = function(index){
    this.entries.push('');
    $(this.tableID).append('<tr id="propEntry'+ index +'"/>')
    this.setUneditable(index);
}


/*
 * Sets a given entry in the table uneditable.
 */
PropertyEntries.prototype.setUneditable = function(index) {
    var property = this.properties[index];
    var name     =  property.property_name;
    var start    = (property.computed_date_start?property.computed_date_start:'∞');
    var date     = (property.date?property.date:'∞');
    var end      = (property.computed_date_end?property.computed_date_end:"∞");
    var value    =  property.value;
    var source   =  property.source_name;


//TODO: if type == succession_relation, make it clickable!
    var entry = '\
    <tr id="propEntry'+ index +'">\
        <td class="key">'+ name +'</td>\
        <td class="date">\
            <span class="bounds">\
                '+ start + '\
                <a href="javascript:EntityObject.nextGeom(-1,'+ index +');">\
                    &#8239;&lt;&#8239;\
                </a>\
            </span>\
                '+ date +'\
            <span class="bounds">\
                <a href="javascript:EntityObject.nextGeom(1,'+ index +');">\
                &#8239;&lt;&#8239;\
                </a>\
                '+ end +'\
            </span>\
        </td>\
        <td class="value">'+ value +'</td>\
        <td class="source">['+ source +']</td>\
        <td>\
            <button class="editButton" onclick="EntityObject.editProp('+ index +');">✎</button>\
        </td>\
    </tr>';

    this.entries[index] = entry;
    $('#propEntry'+index).replaceWith(entry);
}

 
/*
 * Insert an editable row into the table. 
 */
PropertyEntries.prototype.setEditable = function(index){
    this.currEditable = index;

    var property = this.properties[index];
    var name     =  property.property_name;
    var start    = (property.computed_date_start?property.computed_date_start:'∞');
    var date     = (property.date?property.date:'∞');
    var end      = (property.computed_date_end?property.computed_date_end:"∞");
    var value    =  property.value;
    var source   =  property.source_name;

    var editableEntry = '\
    <tr id="propEntry'+ index +'">\
        <td class="key">\
            <select id="propType"/>\
        </td>\
        <td class="date">\
            <input id="date" type="number" value="'+ date +'"/>\
        </td>\
        <td class="value">'+ value +'</td>\
        <td class="source">\
            <input type="text" value="'+ source +'"</td>\
        <td>\
            <button onclick="EntityObject.cancelEdit();">❌</button>\
            <button onclick="EntityObject.saveProp('+ index +');"></button>\
        </td>\
    </tr>';

    var editableEntry = '\
    <tr id="propEntry'+ index +'">\
        <td colspan="5">\
            <div class="editable-property-entry">\
                <div>\
                    <select id="propType"/>\
                    <div id="propValue" style="display:inline">'+ value +'</div>\
                </div>\
                <div style="display:inline">\
                    <label for="date">This property was valid in </label>\
                    <input id="date" type="number" value="'+ date +'"/>\
                    <input id="startCheck" type="checkbox">\
                        This was the start of its validity.\
                    </input>\
                </div>\
                <div>\
                    <label for="date">Source: </label>\
                    <input type="text" value="'+ source +'"</td>\
                </div>\
                <div style="float:right">\
                    <button onclick="EntityObject.cancelEdit();">❌ Cancel</button>\
                    <button onclick="EntityObject.saveProp('+ index +');"> Save</button>\
                </div>\
            </div>\
        </td>\
    </tr>';

    this.entries[index] = editableEntry;
    $('#propEntry'+index).replaceWith(editableEntry);

    //setup property type select...
    this.populateSelect('propType', index, name);
}


/*
 * Set an entry editable
 */
PropertyEntries.prototype.enableEdit = function(index){
    if(this.currEditable < 0){
        this.currEditable = index;
        this.setEditable(index)

        //only one property can be edited at a time.
        $('.editButton').attr("disabled","disaled")
    } 
}


/*
 * Set the currently editable entry non-editable
 */
PropertyEntries.prototype.disableEdit = function(){
    if(this.currEditable >= 0){
        this.setUneditable(this.currEditable)

        //allow to edit all the props
        $('.editButton').removeAttr('disabled');
        
        this.currEditable = -1;
    }
}


/*
 * Populates a table entrie's select. 
 */
PropertyEntries.prototype.populateSelect = function(selectID, index, currValue){
   switch(selectID){
       case 'propType': 
           $.ajax({
               type: "GET",
               dataType: "json",
               url: settings_api_url,
               data: {'query': 'get_property_types'},
               success: function(types,textStatus,jqXHR){
                   $.each(types,function(i,item){ 
                       $('#propType').append($("<option />")
                                         .val(item.id).text(item.name));
                   });

                   //set current value selected
                   $("#propType option").filter(function() {
                       return $(this).text() == currValue; 
                   }).attr('selected', true);
               },
               error: function( jqXHR, textStatus, errorThrown ){
                   console.log('EntityObject: error getting property types!\n'+jqXHR.responseText);
               } 
           });
       break;
   }

   
   this.setValueEditTool();
};	



/*
 * sets the property value edit tool according to chosen property type.
 */
PropertyEntries.prototype.setValueEditTool = function(selectID, index, currValue){
        /*switch($(this).find("option:selected").text()) {
            case 'geom': //TODO: drawing stuff
alert('geom')
                break;

        }*/
alert('geom')

};









