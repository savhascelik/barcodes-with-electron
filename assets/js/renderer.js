
const { remote } = window.require ('electron');
const path = window.require ('path');
const fs = window.require('fs');
var child = window.require('child_process').exec;
var Iconv  = window.require('iconv').Iconv;

execPath = path.dirname (remote.process.execPath);
window.$ = window.jQuery = require('./assets/js/jquery.min.js')
var prnFileContent="";
var prnfile =execPath+"\\resources\\app\\assets\\barcode\\barcode.prn";



//barkod adedi
$("#count").on("click",function(e){
  count=$(this).html();
  count++;
  $(this).html(count);
})

//Yazıcı listesini al ve ilk sıradaki (varsayılan) yazıcıyı değişkene atar
child('wmic printer where "default=True" get name/value',(error, stdout, stderr) => {
    if (error) {
        alert("Yazıcılara erişim hatası",error);
      }
      var yaziciadi =stdout.split("=");
      $("#printers").val(yaziciadi[1]);
  });

//kopyalanan dosya içeriği burada değiştirilir ve arayüzde elementlerin bazı özellikleri değiştirilir
  function readTextFile(prnfile)
  {
    var data= fs.readFileSync(prnfile,{encoding:"latin1"});         
                   var iconv = new Iconv('UTF-8', 'ascii//TRANSLIT');
                   prnFileContent=data;
                   console.log("prnFileContent "+prnFileContent);
                  navigator.clipboard.readText()
                  .then(text => {
                      var clipRows =text.split(/(\t+)/);
                      console.log(clipRows)
                      $("#sirket").val(clipRows[0]);
                      $("#sirket").prop( "disabled", true );
                      prnFileContent = prnFileContent.replace("sirketismi",iconv.convert(clipRows[0]).toString());

                      $("#urunadi").val(clipRows[2]);
                      $("#urunadi").prop( "disabled", true );
                      prnFileContent = prnFileContent.replace("urunadi",iconv.convert(clipRows[2]).toString());

                      $("#barcode").val(clipRows[4]);
                      $("#barcode").prop( "disabled", true );
                      prnFileContent = prnFileContent.replace("barcode",iconv.convert(clipRows[4]).toString());

                      $("#copy").attr("src","assets/img/paste2.png");
                      $('#print').removeAttr('disabled');
                      $(".badge").css("display","none");
                      
                     
                      prnFileContent = prnFileContent.replace("PQ1","PQ"+$("#count").html() );
                      console.log("prnFileContent "+prnFileContent);
                     
                      $('#count').attr( "id", "countt");
                  })
                  .catch(errx => {
                      console.log('Prn Dosyası Okuma Hatası'+ errx);
                  });
      
  }


  //yapıştır işlemi yapıldığında readTextFile() fonk. çağırılır
$('body').bind('paste', null, function(e){

    readTextFile(prnfile);

});

//yazdır butonun basıldığında değiştirilen içerikle -prnFileContent- orjinal dosya içeriği değiştirlir
$("#print").on("click",function () {
    printer= $("#printers").val();

barcodewiter= execPath+"\\resources\\app\\assets\\barcode\\barcodeprint.prn";

 

fs.writeFile(barcodewiter,prnFileContent,{encoding:"latin1"},(error, stdout, stderr)=>{

    if (error) {
        console.log("error"+error);
      }
    
      if (stderr) {
        console.log("stderr"+stderr);
        return stderr;
      }

});

//sistemde yürütülecek kod yapısı
code='print /D:\\\\%COMPUTERNAME%\\'+printer+" "+barcodewiter;

//kodun yürütülmesi
 barcodecommand= child(code,(error, stdout, stderr)=> {
    if (error) {
        alert("Yazıcıya Erişim Hatası",error);
      }
    
      if (stderr) {
        alert("stderr"+stderr);
        return stderr;
      }
      
  });
console.log(barcodecommand);
});