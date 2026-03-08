/**
 * Created by 七夕小雨 on 2014/11/11.
 */

function DEvent(read){
    this.Code = read.readInt32();
    this.Indent = read.readInt32();
    var argc = read.readInt32();
    this.Argv = new Array(argc);

   // console.log("Codeeveeve------------------------->"+this.Code+" Indent:"+this.Indent +" argc:"+argc) ;

    for(var i = 0;i<argc;i++){
        this.Argv[i] = read.readString(read.readInt32(),'UTF-8');
        if(this.Code != 100 && this.Code != 215 && this.Code != 107){
        	this.Argv[i] = this.Argv[i].replace("\\","/");
        }
    }
}
function DEvent1(code,indent,argc,argv)
{
    this.Code = code ;
    this.Indent = indent ;
    var argc = argc ;
    this.Argv = argv ;
}