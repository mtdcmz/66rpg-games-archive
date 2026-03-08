/**
 * Created by lilinlin on 2016/6/29.
 */
function DBitmapFontData(callBack){
    var self = this;
    var urlStr = 'font/font.list';
    var path = fileList[urlStr].url();
    new ORead(path,function(read){
        read.readInt32();
        self.FontName = read.readStringE();
        self.FontSize = read.readInt32();
        self.BitmapPicName = self.FontName + '$' + self.FontSize;
        var BitmapPicNameXfi =  'font/'+self.FontName + '$' + self.FontSize +'.xfi';
        var path2 = fileList[BitmapPicNameXfi.toLowerCase()].url();
        new ORead(path2,function(read){
            self.rows = read.readInt32();
            self.cols = read.readInt32();
            self.maxW = read.readInt32();
            self.maxH = read.readInt32();
            self.count = read.readInt32();
            if(callBack){
                callBack.call(self,read);
            }
        });
    });
}
