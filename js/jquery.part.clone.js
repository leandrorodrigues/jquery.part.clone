/*
 *  Project: Plugin Clone para HasMany
 *  Description: Plugin usado para fazer formulários que permitem inserção de mais de um registro com o botão adicionar e remover
 *  Author: Leandro Rodrigues
 *  License: 
 */

// the semi-colon before function invocation is a safety net against concatenated 
// scripts and/or other plugins which may not be closed properly.
;(function ( $, window, undefined ) {
    
    // undefined is used here as the undefined global variable in ECMAScript 3 is
    // mutable (ie. it can be changed by someone else). undefined isn't really being
    // passed in so we can ensure the value of it is truly undefined. In ES5, undefined
    // can no longer be modified.
    
    // window is passed through as local variable rather than global
    // as this (slightly) quickens the resolution process and can be more efficiently
    // minified (especially when both are regularly referenced in your plugin).
	$('<div id="partClone-buffer" data-clonei="-1" ></div>').hide().appendTo("body");

    // Create the defaults once
    var pluginName = 'partClone',
        document = window.document,
        defaults = {
            addButton : ".clone-add",
            removeButton: ".clone-remove",
            addButtonClass: "btn",
            addButtonText: "<i class=\"icon icon-plus-sign\"></i>&nbsp;Adicionar",
            removeButtonClass: "btn",
            removeButtonText: "<i class=\"icon icon-minus-sign\"></i> Remover",
            itemClass: "well"
        };

    // The actual plugin constructor
    function Plugin( element, options ) {
        this.element = element;

        // jQuery has an extend method which merges the contents of two or 
        // more objects, storing the result in the first object. The first object
        // is generally empty as we don't want to alter the default options for
        // future instances of the plugin
        this.options = $.extend( {}, defaults, options) ;
        
        this._defaults = defaults;
        this._name = pluginName;
        
        this.init();
    }

    Plugin.prototype.init = function () {
    	var e = this.e = $(this.element);
    	
		//cria área no buffer para o modelo
		var buffer = $("#partClone-buffer");
		var cloneIndex = parseInt(buffer.attr('data-clonei')) + 1;
		buffer.attr('data-clonei', cloneIndex.toString());
		
		//cria modelo no buffer
		//botão de remover
		var removeButton = $('<a class="' + this.options['removeButtonClass'] + ' partclone-remove" href="javascript:void(0)">' + this.options['removeButtonText'] + '</a>');
		
		$('<div id="modelo-' + cloneIndex + '" data-modeloi="-1" class="' + this.options['itemClass'] + '">' + this.e.clone().html() + '</div>').appendTo(buffer);
		
		$('#modelo-' + cloneIndex).append(removeButton);
				
		addButton = $('<button type="button" class="' + this.options['addButtonClass'] + '" data-clonei="' + cloneIndex.toString() + '" ></button>').html(this.options['addButtonText']);
		this.e.html('').after(addButton);
		
		addButton.click(function(ev) {
			var bt = $(this);
			var cloneIndex = bt.attr('data-clonei');
			
			//incrementa variável no modelo do buffer.
			var modeloBuffer = $("#modelo-" + cloneIndex);
			var modeloIndex = parseInt(modeloBuffer.attr('data-modeloi')) + 1;
			modeloBuffer.attr('data-modeloi', modeloIndex.toString());
			
			var modelo = modeloBuffer.clone().attr('id', 'modelo-' + cloneIndex + '-item-' + modeloIndex);
			
			//Ajusta os inputs novos
			modelo.find(':input').each(function(iInput, elInput){
				var eInput = $(elInput);
				var eLabel = modelo.find("label[for=" + eInput.attr("id") + "]");
				
				var parts = (/([a-zA-Z0-9_\[\]]*)\[0\]([a-zA-Z0-9_\[\]]*)/).exec(eInput.attr('name'));
				
				var before = parts[1];
				var after = parts[2];
				
				//substituindo o name
				eInput.attr('name', before + "[" + modeloIndex.toString() + "]" + after);
				
				//substituindo Id
				var newId = "modelo-" + cloneIndex.toString() + "-item-" + modeloIndex.toString() + "-input-" + iInput.toString();
				eInput.attr('id', newId);
				
				//Substituido for do label correspondente
				eLabel.attr('for', newId);
			});
			
			//Ação do botão excluir.
			modelo.find(".partclone-remove").click(function(){
				$(this).parent().remove();
			});
			
			e.append(modelo);
		});
    };

    // A really lightweight plugin wrapper around the constructor, 
    // preventing against multiple instantiations
    $.fn[pluginName] = function ( options ) {
        return this.each(function () {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName, new Plugin( this, options ));
            }
        });
    };

}(jQuery, window));