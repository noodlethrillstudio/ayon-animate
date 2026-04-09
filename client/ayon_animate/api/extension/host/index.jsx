//#include "json.js";
//#target animate

var LogFactory = function (path, config) {
    config = config || {};

    var write = config.write !== false;
    var store = config.store || false;
    var level = config.level || "DEBUG";
    var defaultStatus = config.defaultStatus || "LOG";

    var stack = [];
    var times = [];
    var count = 1;

    var logPath = path;

    // Ensure log folder exists
    var folder = logPath.substring(0, logPath.lastIndexOf("/"));
    if (!FLfile.exists(folder)) {
        FLfile.createFolder(folder);
    }

    var LOG_LEVEL = {
        NONE: 7, OFF: 7,
        FATAL: 6,
        ERROR: 5,
        WARN: 4,
        INFO: 3,
        DEBUG: 2,
        TRACE: 1,
        ALL: 0
    };

    var LOG_STATUS = {
        FATAL: 6,
        BUG: 5,
        ERROR: 5,
        WARNING: 4,
        INFO: 3,
        DEBUG: 2,
        LOG: 2,
        TRACE: 1
    };

    var icons = {
        ERROR: "❌",
        WARNING: "⚠️",
        INFO: "ℹ️",
        DEBUG: "🐛",
        LOG: "📝",
        TIMER: "⏱️"
    };

    function getLevel(lvl) {
        if (typeof lvl === "number") return lvl;
        lvl = (lvl || "").toUpperCase();
        return LOG_LEVEL[lvl] !== undefined ? LOG_LEVEL[lvl] : LOG_LEVEL.DEBUG;
    }

    var currentLevel = getLevel(level);

    function stringify(msg) {
        try {
            if (typeof msg === "object") {
                return JSON.stringify(msg);
            }
            return String(msg);
        } catch (e) {
            return "[Unserializable Object]";
        }
    }

    function writeToFile(message) {
        var existing = FLfile.exists(logPath) ? FLfile.read(logPath) : "";
        FLfile.write(logPath, existing + message + "\n");
    }

    var LOG = function (message, status, icon) {
        return LOG.add(message, status, icon);
    };

    LOG.add = function (message, status, icon) {
        status = (status || defaultStatus).toUpperCase();

        var lvl = LOG_STATUS[status] !== undefined ? LOG_STATUS[status] : LOG_LEVEL.DEBUG;
        if (lvl < currentLevel) return;

        var date = new Date();
        var timeStr = "[" + date.toLocaleString() + "]";

        var ic = icon || icons[status] || "";

        var msg =
            "[" + count + "] " +
            "[" + status + "] " +
            ic + " " +
            stringify(message) + " " +
            timeStr;

        if (store) stack.push(msg);
        if (write) writeToFile(msg);

        fl.trace(msg);

        count++;
        return true;
    };

    // =========================
    // CONFIG METHODS
    // =========================

    LOG.setLevel = function (lvl) {
        currentLevel = getLevel(lvl);
    };

    LOG.setStatus = function (status) {
        defaultStatus = status.toUpperCase();
    };

    // =========================
    // TIMER
    // =========================

    LOG.start = function (label) {
        times.push({
            label: label || "",
            time: new Date()
        });
    };

    LOG.stop = function (label) {
        if (!times.length) return;

        var end = new Date();
        var startObj = times.pop();

        var diff = end - startObj.time;

        var msg =
            (startObj.label ? startObj.label + " " : "") +
            "START: " + startObj.time.toLocaleString() + "\n" +
            (label ? label + " " : "") +
            "END: " + end.toLocaleString() + "\n" +
            "TOTAL: " + LOG.prettyTime(diff);

        LOG(msg, "TIMER");
    };

    LOG.prettyTime = function (t) {
        var h = Math.floor(t / 3600000);
        var m = Math.floor((t % 3600000) / 60000);
        var s = Math.floor((t % 60000) / 1000);
        var ms = t % 1000;

        return (
            (h ? h + "h " : "") +
            (m ? m + "m " : "") +
            (s ? s + "s " : "") +
            (ms ? ms + "ms" : "")
        ) || "<1ms";
    };

    // =========================
    // VALUE LOGGER
    // =========================

    LOG.values = function (obj) {
        if (!obj) return;

        var out = [];
        for (var k in obj) {
            try {
                out.push(k + ": " + stringify(obj[k]));
            } catch (e) {
                out.push(k + ": [ERROR]");
            }
        }

        LOG(out.join("\n"), "DEBUG");
    };

    // =========================
    // STACK STORAGE
    // =========================

    LOG.get = function () {
        if (!store) return "Storage disabled";
        return stack.join("\n");
    };

    LOG.reset = function () {
        stack = [];
        count = 1;
    };

    LOG.file = function () {
        return logPath;
    };

    return LOG;
};

var log = new LogFactory('c:/scripts/animateLog.log'); // =>; creates the new log factory - put full path where


function fileOpen(){
    /** Opens a selected document **/
    return fl.openDocument(path);
}

function save(){
    /** Saves active document **/        
    var doc = fl.getDocumentDOM()
    return doc.save();
}

function saveAs(output_path){
    /** Exports scene to various formats
     * 
     * Currently implemented: 'jpg', 'png', 'psd'
     * 
     * output_path - escaped file path on local system
     * ext - extension for export
     * as_copy - create copy, do not overwrite
     * 
     * */
    var doc = fl.getDocumentDOM();
    return doc.saveAsCopy(output_path, false);
    }

function getActiveDocumentName(){
    /**
     *   Returns file name of active document
     * */
    // TODO convert this to jsfl 
    // if (documents.length == 0){
    //     return null;
    // }
    var doc = fl.getDocumentDOM()
    return doc.name;
}

function imprint(payload){
    /**
     *  Sets headline content of current document with metadata. Stores
     *  information about assets created through AYON.
     *  Content accessible in PS through File > File Info
     * 
     **/
    var doc = fl.getDocumentDOM();
    return doc.setMetadata(payload);
}
function close_document(){
    return fl.getDocumentDOM().close(true)
}
function close(){
    return fl.closeAll(true)
}