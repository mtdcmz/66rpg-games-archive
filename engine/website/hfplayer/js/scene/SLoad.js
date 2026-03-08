/**
 * SLoad.js — 本地模式补丁版
 * 修改点：
 *   1. 强制 isNewMapBin = false（直接读取本地二进制）
 *   2. Map_32.bin 失败时自动降级尝试 Map.bin
 *   3. Game_mini.bin 失败时不阻塞，直接 loadOver=true
 *   4. 每步打印 console.log，方便排查
 *   5. 重置 errortimes，防止前次失败污染计数器
 */
function SLoad(){
    // ── 0. 本地模式：强制走直接二进制路径 ──────────────────
    isNewMapBin = false;
    errortimes  = 0;   // 重置全局 ORead 重试计数器

    var sp       = new OSprite(null, null);
    var loadOver = false;
    sp.visible   = true;
    var str = "";
    var w   = g.measureText(str).width;
    sp.drawText(str, (960 - w) / 2, 262);
    sp.y = 500;
    sp.x = 20;
    var time = 0;

    // ── 1. 构造 Map.bin 候选 URL 列表 ────────────────────────
    var urlmap_quality = M_RESOUSE_SERVER_URL + "web/" + guid + "/" + ver + "/Map_" + quality + ".bin";
    var urlmap_plain   = M_RESOUSE_SERVER_URL + "web/" + guid + "/" + ver + "/Map.bin";

    // quality=="0" 或 quality=="25" 等低清模式直接用 Map.bin
    var firstUrl  = (quality != "0") ? urlmap_quality : urlmap_plain;
    var secondUrl = urlmap_plain;   // 降级备用

    console.log("[SLoad] firstUrl  =", firstUrl);
    console.log("[SLoad] secondUrl =", secondUrl);
    console.log("[SLoad] game_bin_path =", game_bin_path);

    gLoadAssets.setDrawText(gLoadAssets.getDataTipsList().mapData);

    // ── 2. 读取并解析 Map.bin 内容 ────────────────────────────
    function parseMapBin(read) {
        console.log("[SLoad] parseMapBin: started");
        var length = read.readInt32();
        console.log("[SLoad] Map.bin entry count =", length);
        for (var i = 0; i < length; i++) {
            try {
                var fd = new fileData(read, 1);
                fileList[fd.fileName] = fd;
                if (quality == 31) {
                    fd.initSize();
                    infoList[fd.url()] = fd.obj;
                }
            } catch(e) {
                console.warn("[SLoad] fileData parse error at index", i, e);
            }
        }
        console.log("[SLoad] Map.bin parsed OK, fileList keys =", Object.keys(fileList).length);
        loadGameMiniBin();
    }

    // ── 3. 读取 Game_mini.bin（失败也不阻塞）────────────────────
    function loadGameMiniBin() {
        gLoadAssets.setDrawText(gLoadAssets.getDataTipsList().parseData);
        console.log("[SLoad] game_bin_path check:", game_bin_path);
        if (game_bin_path == -1 || game_bin_path == "" || !game_bin_path) {
            console.log("[SLoad] no Game_mini.bin path, loadOver=true");
            loadOver = true;
            return;
        }
        var gmUrl = M_RESOUSE_SERVER_URL + game_bin_path;
        console.log("[SLoad] loading Game_mini.bin:", gmUrl);
        gLoadAssets.setDrawText(gLoadAssets.getDataTipsList().mapData);

        var xhr = new XMLHttpRequest();
        xhr.open("GET", gmUrl, true);
        xhr.responseType = "arraybuffer";
        xhr.onload = function() {
            if (xhr.status === 200) {
                console.log("[SLoad] Game_mini.bin loaded OK");
                try {
                    gLoadAssets.setDrawText(gLoadAssets.getDataTipsList().parseData);
                    var read   = new DataStream(xhr.response);
                    var length = read.readInt32();
                    for (var i = 0; i < length; i++) {
                        try {
                            var gd    = new fileData(read, 0);
                            fileList[gd.fileName] = gd;
                        } catch(e) {
                            console.warn("[SLoad] Game_mini.bin entry error at", i);
                        }
                    }
                    console.log("[SLoad] Game_mini.bin parsed, total fileList =", Object.keys(fileList).length);
                } catch(e) {
                    console.warn("[SLoad] Game_mini.bin parse exception:", e);
                }
            } else {
                console.warn("[SLoad] Game_mini.bin HTTP", xhr.status, "— continuing without it");
            }
            loadOver = true;
        };
        xhr.onerror = function() {
            console.warn("[SLoad] Game_mini.bin network error — continuing without it");
            loadOver = true;
        };
        xhr.send();
    }

    // ── 4. 先尝试 firstUrl，失败降级到 secondUrl ─────────────
    function tryLoadMap(url, fallback) {
        console.log("[SLoad] ORead attempt:", url);
        errortimes = 0;  // 每次新请求前清零

        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.responseType = "arraybuffer";
        xhr.onload = function() {
            if (xhr.status === 200) {
                console.log("[SLoad] Map bin loaded OK:", url);
                try {
                    var read = new DataStream(xhr.response);
                    parseMapBin(read);
                } catch(e) {
                    console.error("[SLoad] Map bin parse exception:", e);
                    if (fallback && url !== fallback) {
                        console.warn("[SLoad] Parse failed, trying fallback:", fallback);
                        tryLoadMap(fallback, null);
                    } else {
                        alert("Map.bin 解析失败，请检查文件完整性。");
                    }
                }
            } else {
                console.warn("[SLoad] Map bin HTTP", xhr.status, ":", url);
                if (fallback && url !== fallback) {
                    console.warn("[SLoad] Trying fallback URL:", fallback);
                    tryLoadMap(fallback, null);
                } else {
                    alert("地图文件加载失败（HTTP " + xhr.status + "）\n请确认以下文件存在：\n" + url);
                }
            }
        };
        xhr.onerror = function() {
            console.warn("[SLoad] Map bin connection error:", url);
            if (fallback && url !== fallback) {
                console.warn("[SLoad] Trying fallback URL:", fallback);
                tryLoadMap(fallback, null);
            } else {
                alert("地图文件无法连接\n请检查本地服务器是否运行在端口 8002\n以及文件是否存在：\n" + url);
            }
        };
        xhr.send();
    }

    // ── 5. 启动加载 ─────────────────────────────────────────
    tryLoadMap(firstUrl, secondUrl);

    // ── 6. update：等待 loadOver，然后触发 LoadAssets ─────────
    this.update = function() {
        if (time >= 0) {
            time -= 1;
            if (time == 0) {
                sp.dispose();
                if (gLoadAssets.isNeedLoad()) {
                    // LoadAssets.update() 将接管
                }
            }
            return;
        }
        if (loadOver) {
            time = 5;
            var str = "";
            var w   = g.measureText(str).width;
            sp.drawText(str, (960 - w) / 2, 262);
        }
    };
}

function fileData(read, type) {
    this.fileName = read.readStringE().toLowerCase().replace(/\/\/+/g, '/');
    this.fileSize = read.readInt32();
    this.md5      = read.readStringE();
    if (type == 1 && quality == 31) {
        this.info = read.readStringE();
        this.obj  = {};
        this.initSize = function() {
            if (this.info == 0) {
                this.obj.w = -1;
                this.obj.h = -1;
            } else {
                var dx  = this.info.split(",")[1];
                var arr = dx.split("x");
                this.obj.w = arr[0];
                this.obj.h = arr[1];
            }
        };
    }
    this.url = function() {
        var newVer = GetQueryString("newVer");
        if (newVer) {
            return M_WC_SERVER_URL + "shareres/" + this.md5.substr(0, 2).toLowerCase() + "/" + this.md5;
        }
        return M_RESOUSE_SERVER_URL + "shareres/" + this.md5.substr(0, 2).toLowerCase() + "/" + this.md5;
    };
}

function fileData1(data, type) {
    this.fileName = data[0].toLowerCase().replace(/\/\/+/g, '/');
    this.fileSize = data[1];
    this.md5      = data[2];
    if (type == 1 && quality == 31) {
        this.info = data[3];
        this.obj  = {};
        this.initSize = function() {
            if (this.info.length <= 0) {
                this.obj.w = -1;
                this.obj.h = -1;
            } else {
                var dx  = this.info.split(",")[1];
                var arr = dx.split("x");
                this.obj.w = arr[0];
                this.obj.h = arr[1];
            }
        };
    }
    this.url = function() {
        var newVer = GetQueryString("newVer");
        if (newVer) {
            return M_WC_SERVER_URL + "shareres/" + this.md5.substr(0, 2).toLowerCase() + "/" + this.md5;
        }
        return M_RESOUSE_SERVER_URL + "shareres/" + this.md5.substr(0, 2).toLowerCase() + "/" + this.md5;
    };
}
