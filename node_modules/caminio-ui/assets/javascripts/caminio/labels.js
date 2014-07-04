(function(){

  'use strict';

  window.caminio = caminio || {};
  caminio.labels = caminio.labels || {};

  caminio.labels.getColors = function getLabelColors(){

    var str = '';
    [
      { bgc: '#428BCA', bc: '#26a', fgc: '#fff' },
      { bgc: '#F0AD4E', bc: '#c82', fgc: '#333a3a' },
      { bgc: '#1CAF9A', bc: '#087', fgc: '#fff' },
      { bgc: '#D9534F', bc: '#b32', fgc: '#fff' },
      { bgc: '#1d2939', bc: '#001', fgc: '#fff' },
      { bgc: '#00A0B1', bc: '#008299', fgc: '#fff' },
      { bgc: '#2E8DEF', bc: '#2672EC', fgc: '#fff' },
      { bgc: '#A700AE', bc: '#8C0095', fgc: '#fff' },
      { bgc: '#643EBF', bc: '#5133AB', fgc: '#fff' },
      { bgc: '#BF1E4B', bc: '#AC193D', fgc: '#fff' },
      { bgc: '#DC572E', bc: '#D24726', fgc: '#fff' },
      { bgc: '#00A600', bc: '#008A00', fgc: '#fff' },
      { bgc: '#0A5BC4', bc: '#094AB2', fgc: '#fff' }
    ].forEach( function( colSet ){
      str += '<span class="color" data-fg-color="'+colSet.fgc+'" data-bg-color="'+colSet.bgc+'" data-border-color="'+colSet.bc+'"'+
              'style="background-color:'+colSet.bgc+'; color:'+colSet.fgc+'; border-color: '+colSet.bc+';"></span>';
    });
    return str;
  };

  caminio.labels.getBoxes = function getLabelBoxes(){
    var str = '';
    App.User.store.all('label').content.forEach( function(label){
      str += '<span class="color" data-private="'+label.get('private')+'" data-id="'+label.id+'" title="'+label.get('name')+'" style="background-color:'+label.get('bgColor')+'; color:'+label.get('fgColor')+'; border-color: '+label.get('borderColor')+';"></span>';
    });
    return str;
  };

})();
