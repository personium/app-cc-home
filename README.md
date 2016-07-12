# home-app

## App CellとBox側での役割分担

App Cell側には、画像や共通CSS, JSなどを配置する。
barインストールを前提にしてHTMLはすべてbox側に置く。

・なるべくAppCellにものを置くことでBoxのVersion-upなしで
　AppCell側で動作更新ができる。

・動作はSame Origin前提にしたいため、HTMLファイルはBoxサイドに配置する。

・開発時は各機能Boxサイドの一つのhtmlファイルで完結するように作ることで
　開発のしやすさを確保する。
・開発が進んでゆくにしたがって、共通機能等をでき次第
　appcell側にCSS, JSなどを共通でもつ。

