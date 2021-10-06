Java.perform(function x() {

    Java.deoptimizeBootImage()

    var packageName;
    recv(function (o) {
        packageName = o.package;
        console.log("configured for package " + packageName)
    });

    function classToString(x) {
        var str = null;
        if (x) {
            try {
                if (Array.isArray(x)) {
                    var hash = Java.use('java.util.Arrays').hashCode(x);
                    str = '[Ljava.lang.Object;@' + hash.toString(16);
                } else {
                    var className = '' + x.$className;
                    var classNameJava = Java.use(className);
                    var castObj = Java.cast(x, classNameJava);
                    var hash = castObj.hashCode();
                    str = className + '@' + hash.toString(16);
                }
            } catch (e) {
                console.log("Object was " + x);
                if (e.message.includes("Cast from ") || e.message.startsWith("java.lang.ClassNotFoundException: Didn\'t find class")) {
                    console.log(e.message);
                } else {
                    throw e;
                }
            }
        }
        return str
    }

    function classToHash(x) {
        var str = null;
        if (x != null) {
            try {
                if (Array.isArray(x)) {
                    var hash = Java.use('java.util.Arrays').hashCode(x);
                    str = hash.toString(16);
                } else {
                    var className = '' + x.$className;
                    var classNameJava = Java.use(className);
                    var castObj = Java.cast(x, classNameJava);
                    var hash = castObj.hashCode();
                    str = hash.toString(16);
                }
            } catch (e) {
                console.log("Object to hash was " + x);
                if (e.message.includes("Cast from ") || e.message === 'expected a pointer' || e.message === 'java.lang.NullPointerException: Attempt to get length of null array') {
                    console.log(e.message);
                } else {
                    throw e;
                }
            }
        }
        return str;
    }

    function base64encode(text, noLimit){
        var digits = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        var i = 0;
        var cur, prev, byteNum, result=[];
        if (text == null) {
            return text;
        }
        function isNotZero(x) {
            for (var i = 0; i < x.length; i++) {
                if (x[i] !== 0)
                    return true;
            }
            return false
        }
        if (!isNotZero(text)) {
            return 0;
        }
        while(i < text.length && (noLimit || result.length < 50)){
            cur = text[i];
            byteNum = i % 3;
            switch(byteNum){
                case 0: //first byte
                    result.push(digits.charAt(cur >> 2));
                    break;
                case 1: //second byte
                    result.push(digits.charAt((prev & 3) << 4 | (cur >> 4)));
                    break;
                case 2: //third byte
                    result.push(digits.charAt((prev & 0x0f) << 2 | (cur >> 6)));
                    result.push(digits.charAt(cur & 0x3f));
                    break;
            }
            prev = cur;
            i++;
        }
        if (byteNum == 0){
            result.push(digits.charAt((prev & 3) << 4));
            result.push("==");
        } else if (byteNum == 1){
            result.push(digits.charAt((prev & 0x0f) << 2));
            result.push("=");
        }
        if(i < text.length && !noLimit) {
            result.push("...");
        }
        return result.join("");
    }

    function copy(file, details) {
        try {
            var fileInputStream = Java.use('java.io.FileInputStream').$new(file);
            var inputChannel = fileInputStream.getChannel();
            var size = inputChannel.size();
            if (size > 10000000) {
                console.log("Not copy file since it's to large", file.toString());
            } else {
                var context = Java.use('android.app.ActivityThread').currentApplication().getApplicationContext();
                var copyDestination = 'saved_' + Java.use('java.lang.System').currentTimeMillis() + '_' + file.toPath().getFileName();
                var fileOutput = context.openFileOutput(copyDestination, 0);
                inputChannel.transferTo(0, inputChannel.size(), fileOutput.getChannel());
                fileInputStream.close();
                fileOutput.close();
                details = {...details, originalPath: file.toPath().toString(), copyDestination: Java.use('java.io.File').$new(context.getFilesDir(), copyDestination).toString()};
                return details;
            }
        } catch (error) {
            console.log('Can not copy file, ' + error);
            details = {error: error.message};
        }
        return details;
    }


    Java.use("java.io.File").$init.overload("java.lang.String").implementation = function (arg0) {
        var ret = this.$init(arg0);
        var inPackageName = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()).includes('at ' + packageName + '.');
        var sendObj = {type: "filesystem", function: "java.io.File.$init", thisObjPost: classToHash(this), argTypes: ["java.lang.String"], args:[arg0 ? arg0.slice(0, 300) : arg0], returnType: "java.io.File", returnedObj: classToString(this), isInTargetPackage: inPackageName};
        send(JSON.stringify(sendObj));
        return ret;
    }

    Java.use("java.io.File").$init.overload("java.lang.String", "java.lang.String").implementation = function (arg0, arg1) {
        var ret = this.$init(arg0, arg1);
        var inPackageName = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()).includes('at ' + packageName + '.');
        var sendObj = {type: "filesystem", function: "java.io.File.$init", thisObjPost: classToHash(this), argTypes: ["java.lang.String", "java.lang.String"], args:[arg0 ? arg0.slice(0, 300) : arg0, arg1 ? arg1.slice(0, 300) : arg1], returnType: "java.io.File", returnedObj: classToString(this), isInTargetPackage: inPackageName};
        send(JSON.stringify(sendObj));
        return ret;
    }

    Java.use("java.io.File").$init.overload("java.io.File", "java.lang.String").implementation = function (arg0, arg1) {
        var ret = this.$init(arg0, arg1);
        var details;
        if (arg0 != null) {
            details = {path: arg0.toPath().toString()};
        }

        var inPackageName = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()).includes('at ' + packageName + '.');
        var sendObj = {type: "filesystem", function: "java.io.File.$init", thisObjPost: classToHash(this), argTypes: ["java.io.File", "java.lang.String"], args:[classToString(arg0), arg1 ? arg1.slice(0, 300) : arg1], returnType: "java.io.File", returnedObj: classToString(this), isInTargetPackage: inPackageName, details: details};
        send(JSON.stringify(sendObj));
        return ret;
    }

    Java.use("java.io.File").renameTo.overload("java.io.File").implementation = function (arg0) {
        var thisObjPreExec = classToHash(this);
        var ret = this.renameTo(arg0);
        var details;
        if (arg0 != null) {
            details = {path: arg0.toPath().toString()};
        }

        var inPackageName = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()).includes('at ' + packageName + '.');
        var sendObj = {type: "filesystem", function: "java.io.File.renameTo", thisObjPre: thisObjPreExec, thisObjPost: classToHash(this), argTypes: ["java.io.File"], args:[classToString(arg0)], returnType: "boolean", returnedObj: ret, isInTargetPackage: inPackageName, details: details};
        send(JSON.stringify(sendObj));
        return ret;
    }

    Java.use("java.io.File").createTempFile.overload("java.lang.String", "java.lang.String", "java.io.File").implementation = function (arg0, arg1, arg2) {
        var thisObjPreExec = classToHash(this);
        var ret = this.createTempFile(arg0, arg1, arg2);
        var details;
        if (arg2 != null) {
            details = {path: arg2.toPath().toString()};
        }
        if (ret != null) {
            details = {...details, tempFilePath: ret.toString()};
        }

        var inPackageName = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()).includes('at ' + packageName + '.');
        var sendObj = {type: "filesystem", function: "java.io.File.createTempFile", thisObjPre: thisObjPreExec, thisObjPost: classToHash(this), argTypes: ["java.lang.String", "java.lang.String", "java.io.File"], args:[arg0 ? arg0.slice(0, 300) : arg0, arg1 ? arg1.slice(0, 300) : arg1, classToString(arg2)], returnType: "java.io.File", returnedObj: classToString(ret), isInTargetPackage: inPackageName, details: details};
        send(JSON.stringify(sendObj));
        return ret;
    }

    Java.use("java.io.File").$init.overload("java.net.URI").implementation = function (arg0) {
        var ret = this.$init(arg0);
        var details;
        if (arg0 != null) {
            details = {urlPath: arg0.getPath()};
        }

        var inPackageName = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()).includes('at ' + packageName + '.');
        var sendObj = {type: "filesystem", function: "java.io.File.$init", thisObjPost: classToHash(this), argTypes: ["java.net.URI"], args:[classToString(arg0)], returnType: "java.io.File", returnedObj: classToString(this), isInTargetPackage: inPackageName, details: details};
        send(JSON.stringify(sendObj));
        return ret;
    }

    Java.use("java.io.File").delete.overload().implementation = function () {
        var details;
        if ((this != null) && (this.exists())) {
            details = copy(this, details);
        }

        var thisObjPreExec = classToHash(this);
        var ret = this.delete();
        var inPackageName = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()).includes('at ' + packageName + '.');
        var sendObj = {type: "filesystem", function: "java.io.File.delete", thisObjPre: thisObjPreExec, thisObjPost: classToHash(this), returnType: "boolean", returnedObj: ret, isInTargetPackage: inPackageName, details: details};
        send(JSON.stringify(sendObj));
        return ret;
    }

    Java.use("java.nio.file.Files").copy.overload("java.io.InputStream", "java.nio.file.Path", "[Ljava.nio.file.CopyOption;").implementation = function (arg0, arg1, arg2) {
        var thisObjPreExec = classToHash(this);
        var ret = this.copy(arg0, arg1, arg2);
        var details;
        if (arg1 != null) {
            details = {target: arg1.toString()};
        }

        var inPackageName = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()).includes('at ' + packageName + '.');
        var sendObj = {type: "filesystem", function: "java.nio.file.Files.copy", thisObjPre: thisObjPreExec, thisObjPost: classToHash(this), argTypes: ["java.io.InputStream", "java.nio.file.Path", "java.nio.file.CopyOption..."], args:[classToString(arg0), classToString(arg1), classToString(arg2)], returnType: "long", returnedObj: ret, isInTargetPackage: inPackageName, details: details};
        send(JSON.stringify(sendObj));
        return ret;
    }

    Java.use("java.nio.file.Files").copy.overload("java.nio.file.Path", "java.nio.file.Path", "[Ljava.nio.file.CopyOption;").implementation = function (arg0, arg1, arg2) {
        var thisObjPreExec = classToHash(this);
        var ret = this.copy(arg0, arg1, arg2);
        var details;
        if (arg0 != null) {
            details = {source: arg0.toString()};
        }
        if (arg1 != null) {
            details = {...details, target: arg1.toString()};
        }

        var inPackageName = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()).includes('at ' + packageName + '.');
        var sendObj = {type: "filesystem", function: "java.nio.file.Files.copy", thisObjPre: thisObjPreExec, thisObjPost: classToHash(this), argTypes: ["java.nio.file.Path", "java.nio.file.Path", "java.nio.file.CopyOption..."], args:[classToString(arg0), classToString(arg1), classToString(arg2)], returnType: "java.nio.file.Path", returnedObj: classToString(ret), isInTargetPackage: inPackageName, details: details};
        send(JSON.stringify(sendObj));
        return ret;
    }

    Java.use("java.nio.file.Files").createFile.overload("java.nio.file.Path", "[Ljava.nio.file.attribute.FileAttribute;").implementation = function (arg0, arg1) {
        var thisObjPreExec = classToHash(this);
        var ret = this.createFile(arg0, arg1);
        var details;
        if (arg0 != null) {
            details = {path: arg0.toString()};
        }

        var inPackageName = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()).includes('at ' + packageName + '.');
        var sendObj = {type: "filesystem", function: "java.nio.file.Files.createFile", thisObjPre: thisObjPreExec, thisObjPost: classToHash(this), argTypes: ["java.nio.file.Path", "java.nio.file.attribute.FileAttribute..."], args:[classToString(arg0), classToString(arg1)], returnType: "java.nio.file.Path", returnedObj: classToString(ret), isInTargetPackage: inPackageName, details: details};
        send(JSON.stringify(sendObj));
        return ret;
    }

    Java.use("java.nio.file.Files").createTempFile.overload("java.lang.String", "java.lang.String", "[Ljava.nio.file.attribute.FileAttribute;").implementation = function (arg0, arg1, arg2) {
        var thisObjPreExec = classToHash(this);
        var ret = this.createTempFile(arg0, arg1, arg2);
        var details;
        if (ret != null) {
            details = {path: ret.toString()};
        }

        var inPackageName = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()).includes('at ' + packageName + '.');
        var sendObj = {type: "filesystem", function: "java.nio.file.Files.createTempFile", thisObjPre: thisObjPreExec, thisObjPost: classToHash(this), argTypes: ["java.lang.String", "java.lang.String", "java.nio.file.attribute.FileAttribute..."], args:[arg0 ? arg0.slice(0, 300) : arg0, arg1 ? arg1.slice(0, 300) : arg1, classToString(arg2)], returnType: "java.nio.file.Path", returnedObj: classToString(ret), isInTargetPackage: inPackageName, details: details};
        send(JSON.stringify(sendObj));
        return ret;
    }

    Java.use("java.nio.file.Files").createTempFile.overload("java.nio.file.Path", "java.lang.String", "java.lang.String", "[Ljava.nio.file.attribute.FileAttribute;").implementation = function (arg0, arg1, arg2, arg3) {
        var thisObjPreExec = classToHash(this);
        var ret = this.createTempFile(arg0, arg1, arg2, arg3);
        var details;
        if (ret != null) {
            details = {path: ret.toString()};
        }

        var inPackageName = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()).includes('at ' + packageName + '.');
        var sendObj = {type: "filesystem", function: "java.nio.file.Files.createTempFile", thisObjPre: thisObjPreExec, thisObjPost: classToHash(this), argTypes: ["java.nio.file.Path", "java.lang.String", "java.lang.String", "java.nio.file.attribute.FileAttribute..."], args:[classToString(arg0), arg1 ? arg1.slice(0, 300) : arg1, arg2 ? arg2.slice(0, 300) : arg2, classToString(arg3)], returnType: "java.nio.file.Path", returnedObj: classToString(ret), isInTargetPackage: inPackageName, details: details};
        send(JSON.stringify(sendObj));
        return ret;
    }

    Java.use("java.nio.file.Files").move.overload("java.nio.file.Path", "java.nio.file.Path", "[Ljava.nio.file.CopyOption;").implementation = function (arg0, arg1, arg2) {
        var thisObjPreExec = classToHash(this);
        var ret = this.move(arg0, arg1, arg2);
        var details;
        if (arg0 != null) {
            details = {source: arg0.toString()};
        }
        if (arg1 != null) {
            details = {...details, target: arg1.toString()};
        }

        var inPackageName = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()).includes('at ' + packageName + '.');
        var sendObj = {type: "filesystem", function: "java.nio.file.Files.move", thisObjPre: thisObjPreExec, thisObjPost: classToHash(this), argTypes: ["java.nio.file.Path", "java.nio.file.Path", "java.nio.file.CopyOption..."], args:[classToString(arg0), classToString(arg1), classToString(arg2)], returnType: "java.nio.file.Path", returnedObj: classToString(ret), isInTargetPackage: inPackageName, details: details};
        send(JSON.stringify(sendObj));
        return ret;
    }

    Java.use("java.nio.file.Files").newBufferedWriter.overload("java.nio.file.Path", "java.nio.charset.Charset", "[Ljava.nio.file.OpenOption;").implementation = function (arg0, arg1, arg2) {
        var thisObjPreExec = classToHash(this);
        var ret = this.newBufferedWriter(arg0, arg1, arg2);
        var details;
        if (arg0 != null) {
            details = {path: arg0.toString()};
        }

        var inPackageName = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()).includes('at ' + packageName + '.');
        var sendObj = {type: "filesystem", function: "java.nio.file.Files.newBufferedWriter", thisObjPre: thisObjPreExec, thisObjPost: classToHash(this), argTypes: ["java.nio.file.Path", "java.nio.charset.Charset", "java.nio.file.OpenOption..."], args:[classToString(arg0), classToString(arg1), classToString(arg2)], returnType: "java.io.BufferedWriter", returnedObj: classToString(ret), isInTargetPackage: inPackageName, details: details};
        send(JSON.stringify(sendObj));
        return ret;
    }

    Java.use("java.nio.file.Files").newOutputStream.overload("java.nio.file.Path", "[Ljava.nio.file.OpenOption;").implementation = function (arg0, arg1) {
        var thisObjPreExec = classToHash(this);
        var ret = this.newOutputStream(arg0, arg1);
        var details;
        if (arg0 != null) {
            details = {path: arg0.toString()};
        }

        var inPackageName = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()).includes('at ' + packageName + '.');
        var sendObj = {type: "filesystem", function: "java.nio.file.Files.newOutputStream", thisObjPre: thisObjPreExec, thisObjPost: classToHash(this), argTypes: ["java.nio.file.Path", "java.nio.file.OpenOption..."], args:[classToString(arg0), classToString(arg1)], returnType: "java.io.OutputStream", returnedObj: classToString(ret), isInTargetPackage: inPackageName, details: details};
        send(JSON.stringify(sendObj));
        return ret;
    }

    Java.use("java.nio.file.Files").copy.overload("java.nio.file.Path", "java.io.OutputStream").implementation = function (arg0, arg1) {
        var thisObjPreExec = classToHash(this);
        var ret = this.copy(arg0, arg1);
        var details;
        if (arg0 != null) {
            details = {path: arg0.toString()};
        }

        var inPackageName = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()).includes('at ' + packageName + '.');
        var sendObj = {type: "filesystem", function: "java.nio.file.Files.copy", thisObjPre: thisObjPreExec, thisObjPost: classToHash(this), argTypes: ["java.nio.file.Path", "java.io.OutputStream"], args:[classToString(arg0), classToString(arg1)], returnType: "long", returnedObj: ret, isInTargetPackage: inPackageName, details: details};
        send(JSON.stringify(sendObj));
        return ret;
    }

    Java.use("java.nio.file.Files").write.overload("java.nio.file.Path", "[B", "[Ljava.nio.file.OpenOption;").implementation = function (arg0, arg1, arg2) {
        var thisObjPreExec = classToHash(this);
        var ret = this.write(arg0, arg1, arg2);
        var details;
        if (arg0 != null) {
            details = {path: arg0.toString()};
        }
        if (arg1 != null) {
            var stringClass = Java.use('java.lang.String');
            var argument = stringClass.$new(arg1, 'UTF-8');
            details = {...details, bytes: argument.toString()};
        }

        var inPackageName = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()).includes('at ' + packageName + '.');
        var sendObj = {type: "filesystem", function: "java.nio.file.Files.write", thisObjPre: thisObjPreExec, thisObjPost: classToHash(this), argTypes: ["java.nio.file.Path", "byte[]", "java.nio.file.OpenOption..."], args:[classToString(arg0), base64encode(arg1), classToString(arg2)], returnType: "java.nio.file.Path", returnedObj: classToString(ret), isInTargetPackage: inPackageName, details: details};
        send(JSON.stringify(sendObj));
        return ret;
    }

    Java.use("java.nio.file.Files").write.overload("java.nio.file.Path", "java.lang.Iterable", "java.nio.charset.Charset", "[Ljava.nio.file.OpenOption;").implementation = function (arg0, arg1, arg2, arg3) {
        var thisObjPreExec = classToHash(this);
        var ret = this.write(arg0, arg1, arg2, arg3);
        var details;
        if (arg0 != null) {
            details = {path: arg0.toString()};
        }

        var inPackageName = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()).includes('at ' + packageName + '.');
        var sendObj = {type: "filesystem", function: "java.nio.file.Files.write", thisObjPre: thisObjPreExec, thisObjPost: classToHash(this), argTypes: ["java.nio.file.Path", "java.lang.Iterable", "java.nio.charset.Charset", "java.nio.file.OpenOption..."], args:[classToString(arg0), classToString(arg1), classToString(arg2), classToString(arg3)], returnType: "java.nio.file.Path", returnedObj: classToString(ret), isInTargetPackage: inPackageName, details: details};
        send(JSON.stringify(sendObj));
        return ret;
    }

    Java.use("java.nio.file.Files").delete.overload("java.nio.file.Path").implementation = function (arg0) {
        var details;
        if ((arg0 != null) && (arg0.toFile().exists())) {
            details = {path: arg0.toString()};
            details = copy(arg0.toFile(), details);
        }

        var thisObjPreExec = classToHash(this);
        var ret = this.delete(arg0);
        var inPackageName = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()).includes('at ' + packageName + '.');
        var sendObj = {type: "filesystem", function: "java.nio.file.Files.delete", thisObjPre: thisObjPreExec, thisObjPost: classToHash(this), argTypes: ["java.nio.file.Path"], args:[classToString(arg0)], isInTargetPackage: inPackageName, details: details};
        send(JSON.stringify(sendObj));
        return ret;
    }

    Java.use("java.nio.file.Files").deleteIfExists.overload("java.nio.file.Path").implementation = function (arg0) {
        var details;
        if ((arg0 != null) && (arg0.toFile().exists())) {
            details = {path: arg0.toString()};
            details = copy(arg0.toFile(), details);
        }

        var thisObjPreExec = classToHash(this);
        var ret = this.deleteIfExists(arg0);
        var inPackageName = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()).includes('at ' + packageName + '.');
        var sendObj = {type: "filesystem", function: "java.nio.file.Files.deleteIfExists", thisObjPre: thisObjPreExec, thisObjPost: classToHash(this), argTypes: ["java.nio.file.Path"], args:[classToString(arg0)], isInTargetPackage: inPackageName, details: details};
        send(JSON.stringify(sendObj));
        return ret;
    }

    Java.use("android.app.ContextImpl").openFileOutput.overload("java.lang.String", "int").implementation = function (arg0, arg1) {
        var thisObjPreExec = classToHash(this);
        var ret = this.openFileOutput(arg0, arg1);
        var details;
        var filesDir = this.getFilesDir();
        var path = filesDir.toPath();
        path = path.resolve(arg0);
        details = {path: path.toString()};

        var inPackageName = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()).includes('at ' + packageName + '.');
        var sendObj = {type: "filesystem", function: "android.app.ContextImpl.openFileOutput", thisObjPre: thisObjPreExec, thisObjPost: classToHash(this), argTypes: ["java.lang.String", "int"], args:[arg0 ? arg0.slice(0, 300) : arg0, arg1], returnType: "java.io.FileOutputStream", returnedObj: classToString(ret), isInTargetPackage: inPackageName, details: details};
        send(JSON.stringify(sendObj));
        return ret;
    }

    Java.use("android.app.ContextImpl").openOrCreateDatabase.overload("java.lang.String", "int", "android.database.sqlite.SQLiteDatabase$CursorFactory", "android.database.DatabaseErrorHandler").implementation = function (arg0, arg1, arg2, arg3) {
        var thisObjPreExec = classToHash(this);
        var ret = this.openOrCreateDatabase(arg0, arg1, arg2, arg3);
        var details;
        var databasesDir = this.getDatabasePath(arg0);
        var path = databasesDir.toPath();
        details = {path: path.toString()};

        var inPackageName = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()).includes('at ' + packageName + '.');
        var sendObj = {type: "filesystem", function: "android.app.ContextImpl.openOrCreateDatabase", thisObjPre: thisObjPreExec, thisObjPost: classToHash(this), argTypes: ["java.lang.String", "int", "android.database.sqlite.SQLiteDatabase$CursorFactory", "android.database.DatabaseErrorHandler"], args:[arg0 ? arg0.slice(0, 300) : arg0, arg1, classToString(arg2), classToString(arg3)], returnType: "android.database.sqlite.SQLiteDatabase", returnedObj: classToString(ret), isInTargetPackage: inPackageName, details: details};
        send(JSON.stringify(sendObj));
        return ret;
    }

    Java.use("android.content.ContentResolver").query.overload("android.net.Uri", "[Ljava.lang.String;", "android.os.Bundle", "android.os.CancellationSignal").implementation = function (arg0, arg1, arg2, arg3) {
        var thisObjPreExec = classToHash(this);
        var ret = this.query(arg0, arg1, arg2, arg3);
        var details;
        if (arg0 != null) {
            details = {uri: arg0.getEncodedPath()};
        }

        var inPackageName = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()).includes('at ' + packageName + '.');
        var sendObj = {type: "filesystem", function: "android.content.ContentResolver.query", thisObjPre: thisObjPreExec, thisObjPost: classToHash(this), argTypes: ["android.net.Uri", "java.lang.String[]", "android.os.Bundle", "android.os.CancellationSignal"], args:[classToString(arg0), classToString(arg1), classToString(arg2), classToString(arg3)], returnType: "android.database.Cursor", returnedObj: classToString(ret), isInTargetPackage: inPackageName, details: details};
        send(JSON.stringify(sendObj));
        return ret;
    }

    Java.use("android.content.ContentResolver").query.overload("android.net.Uri", "[Ljava.lang.String;", "java.lang.String", "[Ljava.lang.String;", "java.lang.String", "android.os.CancellationSignal").implementation = function (arg0, arg1, arg2, arg3, arg4, arg5) {
        var thisObjPreExec = classToHash(this);
        var ret = this.query(arg0, arg1, arg2, arg3, arg4, arg5);
        var details;
        if (arg0 != null) {
            details = {uri: arg0.getEncodedPath()};
        }

        var inPackageName = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()).includes('at ' + packageName + '.');
        var sendObj = {type: "filesystem", function: "android.content.ContentResolver.query", thisObjPre: thisObjPreExec, thisObjPost: classToHash(this), argTypes: ["android.net.Uri", "java.lang.String[]", "java.lang.String", "java.lang.String[]", "java.lang.String", "android.os.CancellationSignal"], args:[classToString(arg0), classToString(arg1), arg2 ? arg2.slice(0, 300) : arg2, classToString(arg3), arg4 ? arg4.slice(0, 300) : arg4, classToString(arg5)], returnType: "android.database.Cursor", returnedObj: classToString(ret), isInTargetPackage: inPackageName, details: details};
        send(JSON.stringify(sendObj));
        return ret;
    }

    Java.use("android.content.ContentResolver").query.overload("android.net.Uri", "[Ljava.lang.String;", "java.lang.String", "[Ljava.lang.String;", "java.lang.String").implementation = function (arg0, arg1, arg2, arg3, arg4) {
        var thisObjPreExec = classToHash(this);
        var ret = this.query(arg0, arg1, arg2, arg3, arg4);
        var details;
        if (arg0 != null) {
            details = {uri: arg0.getEncodedPath()};
        }

        var inPackageName = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()).includes('at ' + packageName + '.');
        var sendObj = {type: "filesystem", function: "android.content.ContentResolver.query", thisObjPre: thisObjPreExec, thisObjPost: classToHash(this), argTypes: ["android.net.Uri", "java.lang.String[]", "java.lang.String", "java.lang.String[]", "java.lang.String"], args:[classToString(arg0), classToString(arg1), arg2 ? arg2.slice(0, 300) : arg2, classToString(arg3), arg4 ? arg4.slice(0, 300) : arg4], returnType: "android.database.Cursor", returnedObj: classToString(ret), isInTargetPackage: inPackageName, details: details};
        send(JSON.stringify(sendObj));
        return ret;
    }

    Java.use("android.content.ContentResolver").registerContentObserver.overload("android.net.Uri", "boolean", "android.database.ContentObserver", "int").implementation = function (arg0, arg1, arg2, arg3) {
        var thisObjPreExec = classToHash(this);
        var ret = this.registerContentObserver(arg0, arg1, arg2, arg3);
        var details;
        if (arg0 != null) {
            details = {uri: arg0.getEncodedPath()};
        }

        var inPackageName = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()).includes('at ' + packageName + '.');
        var sendObj = {type: "filesystem", function: "android.content.ContentResolver.registerContentObserver", thisObjPre: thisObjPreExec, thisObjPost: classToHash(this), argTypes: ["android.net.Uri", "boolean", "android.database.ContentObserver", "int"], args:[classToString(arg0), arg1, classToString(arg2), arg3], isInTargetPackage: inPackageName, details: details};
        send(JSON.stringify(sendObj));
        return ret;
    }

    Java.use("android.content.ContentResolver").insert.overload("android.net.Uri", "android.content.ContentValues", "android.os.Bundle").implementation = function (arg0, arg1, arg2) {
        var thisObjPreExec = classToHash(this);
        var ret = this.insert(arg0, arg1, arg2);
        var details;
        if (arg0 != null) {
            details = {uri: arg0.getEncodedPath()};
        }

        var inPackageName = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()).includes('at ' + packageName + '.');
        var sendObj = {type: "filesystem", function: "android.content.ContentResolver.insert", thisObjPre: thisObjPreExec, thisObjPost: classToHash(this), argTypes: ["android.net.Uri", "android.content.ContentValues", "android.os.Bundle"], args:[classToString(arg0), classToString(arg1), classToString(arg2)], returnType: "android.net.Uri", returnedObj: classToString(ret), isInTargetPackage: inPackageName, details: details};
        send(JSON.stringify(sendObj));
        return ret;
    }

    Java.use("android.content.ContentResolver").insert.overload("android.net.Uri", "android.content.ContentValues").implementation = function (arg0, arg1) {
        var thisObjPreExec = classToHash(this);
        var ret = this.insert(arg0, arg1);
        var details;
        if (arg0 != null) {
            details = {uri: arg0.getEncodedPath()};
        }

        var inPackageName = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()).includes('at ' + packageName + '.');
        var sendObj = {type: "filesystem", function: "android.content.ContentResolver.insert", thisObjPre: thisObjPreExec, thisObjPost: classToHash(this), argTypes: ["android.net.Uri", "android.content.ContentValues"], args:[classToString(arg0), classToString(arg1)], returnType: "android.net.Uri", returnedObj: classToString(ret), isInTargetPackage: inPackageName, details: details};
        send(JSON.stringify(sendObj));
        return ret;
    }

    Java.use("android.content.ContentResolver").delete.overload("android.net.Uri", "java.lang.String", "[Ljava.lang.String;").implementation = function (arg0, arg1, arg2) {
        var thisObjPreExec = classToHash(this);
        var ret = this.delete(arg0, arg1, arg2);
        var details;
        if (arg0 != null) {
            details = {uri: arg0.getEncodedPath()};
        }

        var inPackageName = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()).includes('at ' + packageName + '.');
        var sendObj = {type: "filesystem", function: "android.content.ContentResolver.delete", thisObjPre: thisObjPreExec, thisObjPost: classToHash(this), argTypes: ["android.net.Uri", "java.lang.String", "java.lang.String[]"], args:[classToString(arg0), arg1 ? arg1.slice(0, 300) : arg1, classToString(arg2)], returnType: "int", returnedObj: ret, isInTargetPackage: inPackageName, details: details};
        send(JSON.stringify(sendObj));
        return ret;
    }

    Java.use("android.content.ContentResolver").delete.overload("android.net.Uri", "android.os.Bundle").implementation = function (arg0, arg1) {
        var thisObjPreExec = classToHash(this);
        var ret = this.delete(arg0, arg1);
        var details;
        if (arg0 != null) {
            details = {uri: arg0.getEncodedPath()};
        }

        var inPackageName = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()).includes('at ' + packageName + '.');
        var sendObj = {type: "filesystem", function: "android.content.ContentResolver.delete", thisObjPre: thisObjPreExec, thisObjPost: classToHash(this), argTypes: ["android.net.Uri", "android.os.Bundle"], args:[classToString(arg0), classToString(arg1)], returnType: "int", returnedObj: ret, isInTargetPackage: inPackageName, details: details};
        send(JSON.stringify(sendObj));
        return ret;
    }

    Java.use("android.content.ContentResolver").update.overload("android.net.Uri", "android.content.ContentValues", "android.os.Bundle").implementation = function (arg0, arg1, arg2) {
        var thisObjPreExec = classToHash(this);
        var ret = this.update(arg0, arg1, arg2);
        var details;
        if (arg0 != null) {
            details = {uri: arg0.getEncodedPath()};
        }

        var inPackageName = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()).includes('at ' + packageName + '.');
        var sendObj = {type: "filesystem", function: "android.content.ContentResolver.update", thisObjPre: thisObjPreExec, thisObjPost: classToHash(this), argTypes: ["android.net.Uri", "android.content.ContentValues", "android.os.Bundle"], args:[classToString(arg0), classToString(arg1), classToString(arg2)], returnType: "int", returnedObj: ret, isInTargetPackage: inPackageName, details: details};
        send(JSON.stringify(sendObj));
        return ret;
    }

    Java.use("android.content.ContentResolver").update.overload("android.net.Uri", "android.content.ContentValues", "java.lang.String", "[Ljava.lang.String;").implementation = function (arg0, arg1, arg2, arg3) {
        var thisObjPreExec = classToHash(this);
        var ret = this.update(arg0, arg1, arg2, arg3);
        var details;
        if (arg0 != null) {
            details = {uri: arg0.getEncodedPath()};
        }

        var inPackageName = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()).includes('at ' + packageName + '.');
        var sendObj = {type: "filesystem", function: "android.content.ContentResolver.update", thisObjPre: thisObjPreExec, thisObjPost: classToHash(this), argTypes: ["android.net.Uri", "android.content.ContentValues", "java.lang.String", "java.lang.String[]"], args:[classToString(arg0), classToString(arg1), arg2 ? arg2.slice(0, 300) : arg2, classToString(arg3)], returnType: "int", returnedObj: ret, isInTargetPackage: inPackageName, details: details};
        send(JSON.stringify(sendObj));
        return ret;
    }

    Java.use("android.content.ContentResolver").call.overload("android.net.Uri", "java.lang.String", "java.lang.String", "android.os.Bundle").implementation = function (arg0, arg1, arg2, arg3) {
        var thisObjPreExec = classToHash(this);
        var ret = this.call(arg0, arg1, arg2, arg3);
        var details;
        if (arg0 != null) {
            details = {uri: arg0.getEncodedPath()};
        }

        var inPackageName = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()).includes('at ' + packageName + '.');
        var sendObj = {type: "filesystem", function: "android.content.ContentResolver.call", thisObjPre: thisObjPreExec, thisObjPost: classToHash(this), argTypes: ["android.net.Uri", "java.lang.String", "java.lang.String", "android.os.Bundle"], args:[classToString(arg0), arg1 ? arg1.slice(0, 300) : arg1, arg2 ? arg2.slice(0, 300) : arg2, classToString(arg3)], returnType: "android.os.Bundle", returnedObj: classToString(ret), isInTargetPackage: inPackageName, details: details};
        send(JSON.stringify(sendObj));
        return ret;
    }

    Java.use("android.content.ContentResolver").call.overload("java.lang.String", "java.lang.String", "java.lang.String", "android.os.Bundle").implementation = function (arg0, arg1, arg2, arg3) {
        var thisObjPreExec = classToHash(this);
        var ret = this.call(arg0, arg1, arg2, arg3);
        var inPackageName = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()).includes('at ' + packageName + '.');
        var sendObj = {type: "filesystem", function: "android.content.ContentResolver.call", thisObjPre: thisObjPreExec, thisObjPost: classToHash(this), argTypes: ["java.lang.String", "java.lang.String", "java.lang.String", "android.os.Bundle"], args:[arg0 ? arg0.slice(0, 300) : arg0, arg1 ? arg1.slice(0, 300) : arg1, arg2 ? arg2.slice(0, 300) : arg2, classToString(arg3)], returnType: "android.os.Bundle", returnedObj: classToString(ret), isInTargetPackage: inPackageName};
        send(JSON.stringify(sendObj));
        return ret;
    }

    Java.use("android.content.ContentResolver").registerContentObserver.overload("android.net.Uri", "boolean", "android.database.ContentObserver").implementation = function (arg0, arg1, arg2) {
        var thisObjPreExec = classToHash(this);
        var ret = this.registerContentObserver(arg0, arg1, arg2);
        var details;
        if (arg0 != null) {
            details = {uri: arg0.getEncodedPath()};
        }

        var inPackageName = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()).includes('at ' + packageName + '.');
        var sendObj = {type: "filesystem", function: "android.content.ContentResolver.registerContentObserver", thisObjPre: thisObjPreExec, thisObjPost: classToHash(this), argTypes: ["android.net.Uri", "boolean", "android.database.ContentObserver"], args:[classToString(arg0), arg1, classToString(arg2)], isInTargetPackage: inPackageName, details: details};
        send(JSON.stringify(sendObj));
        return ret;
    }

    Java.use("android.content.ContentResolver").unregisterContentObserver.overload("android.database.ContentObserver").implementation = function (arg0) {
        var thisObjPreExec = classToHash(this);
        var ret = this.unregisterContentObserver(arg0);
        var inPackageName = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()).includes('at ' + packageName + '.');
        var sendObj = {type: "filesystem", function: "android.content.ContentResolver.unregisterContentObserver", thisObjPre: thisObjPreExec, thisObjPost: classToHash(this), argTypes: ["android.database.ContentObserver"], args:[classToString(arg0)], isInTargetPackage: inPackageName};
        send(JSON.stringify(sendObj));
        return ret;
    }

    Java.use("android.content.ContentResolver").openOutputStream.overload("android.net.Uri", "java.lang.String").implementation = function (arg0, arg1) {
        var thisObjPreExec = classToHash(this);
        var ret = this.openOutputStream(arg0, arg1);
        var details;
        if (arg0 != null) {
            details = {uri: arg0.getEncodedPath()};
        }

        var inPackageName = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()).includes('at ' + packageName + '.');
        var sendObj = {type: "filesystem", function: "android.content.ContentResolver.openOutputStream", thisObjPre: thisObjPreExec, thisObjPost: classToHash(this), argTypes: ["android.net.Uri", "java.lang.String"], args:[classToString(arg0), arg1 ? arg1.slice(0, 300) : arg1], returnType: "java.io.OutputStream", returnedObj: classToString(ret), isInTargetPackage: inPackageName, details: details};
        send(JSON.stringify(sendObj));
        return ret;
    }

    Java.use("android.content.ContentResolver").openFileDescriptor.overload("android.net.Uri", "java.lang.String", "android.os.CancellationSignal").implementation = function (arg0, arg1, arg2) {
        var thisObjPreExec = classToHash(this);
        var ret = this.openFileDescriptor(arg0, arg1, arg2);
        var details;
        if (arg0 != null) {
            details = {uri: arg0.getEncodedPath()};
        }

        var inPackageName = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()).includes('at ' + packageName + '.');
        var sendObj = {type: "filesystem", function: "android.content.ContentResolver.openFileDescriptor", thisObjPre: thisObjPreExec, thisObjPost: classToHash(this), argTypes: ["android.net.Uri", "java.lang.String", "android.os.CancellationSignal"], args:[classToString(arg0), arg1 ? arg1.slice(0, 300) : arg1, classToString(arg2)], returnType: "android.os.ParcelFileDescriptor", returnedObj: classToString(ret), isInTargetPackage: inPackageName, details: details};
        send(JSON.stringify(sendObj));
        return ret;
    }

    Java.use("android.content.ContentResolver").delete.overload("android.net.Uri", "android.os.Bundle").implementation = function (arg0, arg1) {
        var details;
        if (arg0 != null) {
            var path = arg0.getEncodedPath();
            var file = Java.use('java.io.File').$new(path);
            if ((file != null) && (file.exists())) {
                details = copy(file, details);
            }
        }

        var thisObjPreExec = classToHash(this);
        var ret = this.delete(arg0, arg1);
        var inPackageName = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()).includes('at ' + packageName + '.');
        var sendObj = {type: "filesystem", function: "android.content.ContentResolver.delete", thisObjPre: thisObjPreExec, thisObjPost: classToHash(this), argTypes: ["android.net.Uri", "android.os.Bundle"], args:[classToString(arg0), classToString(arg1)], returnType: "int", returnedObj: ret, isInTargetPackage: inPackageName, details: details};
        send(JSON.stringify(sendObj));
        return ret;
    }

    Java.use("android.app.SharedPreferencesImpl$EditorImpl").putBoolean.overload("java.lang.String", "boolean").implementation = function (arg0, arg1) {
        var thisObjPreExec = classToHash(this);
        var ret = this.putBoolean(arg0, arg1);
        var inPackageName = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()).includes('at ' + packageName + '.');
        var sendObj = {type: "filesystem", function: "android.app.SharedPreferencesImpl$EditorImpl.putBoolean", thisObjPre: thisObjPreExec, thisObjPost: classToHash(this), argTypes: ["java.lang.String", "boolean"], args:[arg0 ? arg0.slice(0, 300) : arg0, arg1], returnType: "android.content.SharedPreferences$Editor", returnedObj: classToString(ret), isInTargetPackage: inPackageName};
        send(JSON.stringify(sendObj));
        return ret;
    }

    Java.use("android.app.SharedPreferencesImpl$EditorImpl").putFloat.overload("java.lang.String", "float").implementation = function (arg0, arg1) {
        var thisObjPreExec = classToHash(this);
        var ret = this.putFloat(arg0, arg1);
        var inPackageName = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()).includes('at ' + packageName + '.');
        var sendObj = {type: "filesystem", function: "android.app.SharedPreferencesImpl$EditorImpl.putFloat", thisObjPre: thisObjPreExec, thisObjPost: classToHash(this), argTypes: ["java.lang.String", "float"], args:[arg0 ? arg0.slice(0, 300) : arg0, arg1], returnType: "android.content.SharedPreferences$Editor", returnedObj: classToString(ret), isInTargetPackage: inPackageName};
        send(JSON.stringify(sendObj));
        return ret;
    }

    Java.use("android.app.SharedPreferencesImpl$EditorImpl").putInt.overload("java.lang.String", "int").implementation = function (arg0, arg1) {
        var thisObjPreExec = classToHash(this);
        var ret = this.putInt(arg0, arg1);
        var inPackageName = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()).includes('at ' + packageName + '.');
        var sendObj = {type: "filesystem", function: "android.app.SharedPreferencesImpl$EditorImpl.putInt", thisObjPre: thisObjPreExec, thisObjPost: classToHash(this), argTypes: ["java.lang.String", "int"], args:[arg0 ? arg0.slice(0, 300) : arg0, arg1], returnType: "android.content.SharedPreferences$Editor", returnedObj: classToString(ret), isInTargetPackage: inPackageName};
        send(JSON.stringify(sendObj));
        return ret;
    }

    Java.use("android.app.SharedPreferencesImpl$EditorImpl").putLong.overload("java.lang.String", "long").implementation = function (arg0, arg1) {
        var thisObjPreExec = classToHash(this);
        var ret = this.putLong(arg0, arg1);
        var inPackageName = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()).includes('at ' + packageName + '.');
        var sendObj = {type: "filesystem", function: "android.app.SharedPreferencesImpl$EditorImpl.putLong", thisObjPre: thisObjPreExec, thisObjPost: classToHash(this), argTypes: ["java.lang.String", "long"], args:[arg0 ? arg0.slice(0, 300) : arg0, arg1], returnType: "android.content.SharedPreferences$Editor", returnedObj: classToString(ret), isInTargetPackage: inPackageName};
        send(JSON.stringify(sendObj));
        return ret;
    }

    Java.use("android.app.SharedPreferencesImpl$EditorImpl").putString.overload("java.lang.String", "java.lang.String").implementation = function (arg0, arg1) {
        var thisObjPreExec = classToHash(this);
        var ret = this.putString(arg0, arg1);
        var inPackageName = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()).includes('at ' + packageName + '.');
        var sendObj = {type: "filesystem", function: "android.app.SharedPreferencesImpl$EditorImpl.putString", thisObjPre: thisObjPreExec, thisObjPost: classToHash(this), argTypes: ["java.lang.String", "java.lang.String"], args:[arg0 ? arg0.slice(0, 300) : arg0, arg1 ? arg1.slice(0, 300) : arg1], returnType: "android.content.SharedPreferences$Editor", returnedObj: classToString(ret), isInTargetPackage: inPackageName};
        send(JSON.stringify(sendObj));
        return ret;
    }

    Java.use("android.app.SharedPreferencesImpl$EditorImpl").putStringSet.overload("java.lang.String", "java.util.Set").implementation = function (arg0, arg1) {
        var thisObjPreExec = classToHash(this);
        var ret = this.putStringSet(arg0, arg1);
        var details;
        if (arg1 != null) {
            var result = [];
            var iterator = arg1.iterator();
            while (iterator.hasNext()) {
                result.push(Java.cast(iterator.next(), Java.use("java.lang.String")).toString());
            }
            details = {setContent: JSON.stringify(result)};
        }

        var inPackageName = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()).includes('at ' + packageName + '.');
        var sendObj = {type: "filesystem", function: "android.app.SharedPreferencesImpl$EditorImpl.putStringSet", thisObjPre: thisObjPreExec, thisObjPost: classToHash(this), argTypes: ["java.lang.String", "java.util.Set"], args:[arg0 ? arg0.slice(0, 300) : arg0, classToString(arg1)], returnType: "android.content.SharedPreferences$Editor", returnedObj: classToString(ret), isInTargetPackage: inPackageName, details: details};
        send(JSON.stringify(sendObj));
        return ret;
    }

    Java.use("android.database.sqlite.SQLiteDatabase").executeSql.overload("java.lang.String", "[Ljava.lang.Object;").implementation = function (arg0, arg1) {
        var thisObjPreExec = classToHash(this);
        var ret = this.executeSql(arg0, arg1);
        var inPackageName = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()).includes('at ' + packageName + '.');
        var sendObj = {type: "filesystem", function: "android.database.sqlite.SQLiteDatabase.executeSql", thisObjPre: thisObjPreExec, thisObjPost: classToHash(this), argTypes: ["java.lang.String", "java.lang.Object[]"], args:[arg0 ? arg0.slice(0, 300) : arg0, classToString(arg1)], returnType: "int", returnedObj: ret, isInTargetPackage: inPackageName};
        send(JSON.stringify(sendObj));
        return ret;
    }

    Java.use("android.database.sqlite.SQLiteDatabase").insertWithOnConflict.overload("java.lang.String", "java.lang.String", "android.content.ContentValues", "int").implementation = function (arg0, arg1, arg2, arg3) {
        var thisObjPreExec = classToHash(this);
        var ret = this.insertWithOnConflict(arg0, arg1, arg2, arg3);
        var details;
        if (arg2 != null) {
            var result = new Map();
            var keySetIterator = arg2.keySet().iterator();
            while (keySetIterator.hasNext()) {
                var next = keySetIterator.next();
                var val = null
                if (arg2.get(next) != null) {
                    val = Java.cast(arg2.get(next), Java.use("java.lang.Object")).toString();
                }
                result.set(Java.cast(next, Java.use("java.lang.String")).toString(), val);
            }
            details = {contentValues: JSON.stringify([...result])};
        }

        var inPackageName = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()).includes('at ' + packageName + '.');
        var sendObj = {type: "filesystem", function: "android.database.sqlite.SQLiteDatabase.insertWithOnConflict", thisObjPre: thisObjPreExec, thisObjPost: classToHash(this), argTypes: ["java.lang.String", "java.lang.String", "android.content.ContentValues", "int"], args:[arg0 ? arg0.slice(0, 300) : arg0, arg1 ? arg1.slice(0, 300) : arg1, classToString(arg2), arg3], returnType: "long", returnedObj: ret, isInTargetPackage: inPackageName, details: details};
        send(JSON.stringify(sendObj));
        return ret;
    }

    Java.use("android.database.sqlite.SQLiteDatabase").rawQueryWithFactory.overload("android.database.sqlite.SQLiteDatabase$CursorFactory", "java.lang.String", "[Ljava.lang.String;", "java.lang.String", "android.os.CancellationSignal").implementation = function (arg0, arg1, arg2, arg3, arg4) {
        var thisObjPreExec = classToHash(this);
        var ret = this.rawQueryWithFactory(arg0, arg1, arg2, arg3, arg4);
        var details;
        if (arg2 != null) {
            var result = [];
            arg2.forEach(function (item, index) {
                result.push(item);
            });
            details = {selectionArgs: JSON.stringify(result)};
        }

        var inPackageName = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()).includes('at ' + packageName + '.');
        var sendObj = {type: "filesystem", function: "android.database.sqlite.SQLiteDatabase.rawQueryWithFactory", thisObjPre: thisObjPreExec, thisObjPost: classToHash(this), argTypes: ["android.database.sqlite.SQLiteDatabase$CursorFactory", "java.lang.String", "java.lang.String[]", "java.lang.String", "android.os.CancellationSignal"], args:[classToString(arg0), arg1 ? arg1.slice(0, 300) : arg1, classToString(arg2), arg3 ? arg3.slice(0, 300) : arg3, classToString(arg4)], returnType: "android.database.Cursor", returnedObj: classToString(ret), isInTargetPackage: inPackageName, details: details};
        send(JSON.stringify(sendObj));
        return ret;
    }

    Java.use("android.database.sqlite.SQLiteDatabase").updateWithOnConflict.overload("java.lang.String", "android.content.ContentValues", "java.lang.String", "[Ljava.lang.String;", "int").implementation = function (arg0, arg1, arg2, arg3, arg4) {
        var thisObjPreExec = classToHash(this);
        var ret = this.updateWithOnConflict(arg0, arg1, arg2, arg3, arg4);
        var details;
        if (arg1 != null) {
            var result = new Map();
            var keySetIterator = arg1.keySet().iterator();
            while (keySetIterator.hasNext()) {
                var next = keySetIterator.next();
                var val = null
                if (arg1.get(next) != null) {
                    val = Java.cast(arg1.get(next), Java.use("java.lang.Object")).toString();
                }
                result.set(Java.cast(next, Java.use("java.lang.String")).toString(), val);
            }
            details = {contentValues: JSON.stringify([...result])};
        }
        if (arg3 != null) {
            var result = [];
            arg3.forEach(function (item, index) {
                result.push(item);
            });
            details = {...details, whereArgs: JSON.stringify(result)};
        }

        var inPackageName = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()).includes('at ' + packageName + '.');
        var sendObj = {type: "filesystem", function: "android.database.sqlite.SQLiteDatabase.updateWithOnConflict", thisObjPre: thisObjPreExec, thisObjPost: classToHash(this), argTypes: ["java.lang.String", "android.content.ContentValues", "java.lang.String", "java.lang.String[]", "int"], args:[arg0 ? arg0.slice(0, 300) : arg0, classToString(arg1), arg2 ? arg2.slice(0, 300) : arg2, classToString(arg3), arg4], returnType: "int", returnedObj: ret, isInTargetPackage: inPackageName, details: details};
        send(JSON.stringify(sendObj));
        return ret;
    }

    Java.use("android.database.sqlite.SQLiteDatabase").delete.overload("java.lang.String", "java.lang.String", "[Ljava.lang.String;").implementation = function (arg0, arg1, arg2) {
        var details;
        var path = this.getPath();
        var file = Java.use('java.io.File').$new(path);
        if ((file != null) && (file.exists())) {
            details = copy(file, details);
        }

        var thisObjPreExec = classToHash(this);
        var ret = this.delete(arg0, arg1, arg2);
        var inPackageName = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()).includes('at ' + packageName + '.');
        var sendObj = {type: "filesystem", function: "android.database.sqlite.SQLiteDatabase.delete", thisObjPre: thisObjPreExec, thisObjPost: classToHash(this), argTypes: ["java.lang.String", "java.lang.String", "java.lang.String[]"], args:[arg0 ? arg0.slice(0, 300) : arg0, arg1 ? arg1.slice(0, 300) : arg1, classToString(arg2)], returnType: "int", returnedObj: ret, isInTargetPackage: inPackageName, details: details};
        send(JSON.stringify(sendObj));
        return ret;
    }

    Java.use("java.security.KeyStore$PasswordProtection").$init.overload("[C").implementation = function (arg0) {
        var ret = this.$init(arg0);
        var details;
        if (arg0 != null) {
            var string = Java.use('java.lang.String');
            var passwordToString = string.$new(arg0);
            details = {password: passwordToString.toString()};
        }

        var inPackageName = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()).includes('at ' + packageName + '.');
        var sendObj = {type: "filesystem", function: "java.security.KeyStore$PasswordProtection.$init", thisObjPost: classToHash(this), argTypes: ["char[]"], args:[base64encode(arg0)], returnType: "java.security.KeyStore$PasswordProtection", returnedObj: classToString(this), isInTargetPackage: inPackageName, details: details};
        send(JSON.stringify(sendObj));
        return ret;
    }

    Java.use("java.security.KeyStore$PasswordProtection").$init.overload("[C", "java.lang.String", "java.security.spec.AlgorithmParameterSpec").implementation = function (arg0, arg1, arg2) {
        var ret = this.$init(arg0, arg1, arg2);
        var details;
        if (arg0 != null) {
            var string = Java.use('java.lang.String');
            var passwordToString = string.$new(arg0);
            details = {password: passwordToString.toString()};
        }

        var inPackageName = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()).includes('at ' + packageName + '.');
        var sendObj = {type: "filesystem", function: "java.security.KeyStore$PasswordProtection.$init", thisObjPost: classToHash(this), argTypes: ["char[]", "java.lang.String", "java.security.spec.AlgorithmParameterSpec"], args:[base64encode(arg0), arg1 ? arg1.slice(0, 300) : arg1, classToString(arg2)], returnType: "java.security.KeyStore$PasswordProtection", returnedObj: classToString(this), isInTargetPackage: inPackageName, details: details};
        send(JSON.stringify(sendObj));
        return ret;
    }

    Java.use("java.nio.file.Paths").get.overload("java.net.URI").implementation = function (arg0) {
        var thisObjPreExec = classToHash(this);
        var ret = this.get(arg0);
        var details;
        if (ret != null) {
            details = {path: ret.toString()};
        }

        var inPackageName = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()).includes('at ' + packageName + '.');
        var sendObj = {type: "filesystem", function: "java.nio.file.Paths.get", thisObjPre: thisObjPreExec, thisObjPost: classToHash(this), argTypes: ["java.net.URI"], args:[classToString(arg0)], returnType: "java.nio.file.Path", returnedObj: classToString(ret), isInTargetPackage: inPackageName, details: details};
        send(JSON.stringify(sendObj));
        return ret;
    }

    Java.use("java.nio.file.Paths").get.overload("java.lang.String", "[Ljava.lang.String;").implementation = function (arg0, arg1) {
        var thisObjPreExec = classToHash(this);
        var ret = this.get(arg0, arg1);
        var details;
        if (ret != null) {
            details = {path: ret.toString()};
        }

        var inPackageName = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()).includes('at ' + packageName + '.');
        var sendObj = {type: "filesystem", function: "java.nio.file.Paths.get", thisObjPre: thisObjPreExec, thisObjPost: classToHash(this), argTypes: ["java.lang.String", "java.lang.String..."], args:[arg0 ? arg0.slice(0, 300) : arg0, classToString(arg1)], returnType: "java.nio.file.Path", returnedObj: classToString(ret), isInTargetPackage: inPackageName, details: details};
        send(JSON.stringify(sendObj));
        return ret;
    }

    Java.use("java.io.FileWriter").$init.overload("java.lang.String").implementation = function (arg0) {
        var ret = this.$init(arg0);
        var inPackageName = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()).includes('at ' + packageName + '.');
        var sendObj = {type: "filesystem", function: "java.io.FileWriter.$init", thisObjPost: classToHash(this), argTypes: ["java.lang.String"], args:[arg0 ? arg0.slice(0, 300) : arg0], returnType: "java.io.FileWriter", returnedObj: classToString(this), isInTargetPackage: inPackageName};
        send(JSON.stringify(sendObj));
        return ret;
    }

    Java.use("java.io.FileWriter").$init.overload("java.lang.String", "boolean").implementation = function (arg0, arg1) {
        var ret = this.$init(arg0, arg1);
        var inPackageName = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()).includes('at ' + packageName + '.');
        var sendObj = {type: "filesystem", function: "java.io.FileWriter.$init", thisObjPost: classToHash(this), argTypes: ["java.lang.String", "boolean"], args:[arg0 ? arg0.slice(0, 300) : arg0, arg1], returnType: "java.io.FileWriter", returnedObj: classToString(this), isInTargetPackage: inPackageName};
        send(JSON.stringify(sendObj));
        return ret;
    }

    Java.use("java.io.FileWriter").$init.overload("java.io.File").implementation = function (arg0) {
        var ret = this.$init(arg0);
        var details;
        if (arg0 != null) {
            details = {path: arg0.toPath().toString()};
        }

        var inPackageName = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()).includes('at ' + packageName + '.');
        var sendObj = {type: "filesystem", function: "java.io.FileWriter.$init", thisObjPost: classToHash(this), argTypes: ["java.io.File"], args:[classToString(arg0)], returnType: "java.io.FileWriter", returnedObj: classToString(this), isInTargetPackage: inPackageName, details: details};
        send(JSON.stringify(sendObj));
        return ret;
    }

    Java.use("java.io.FileWriter").$init.overload("java.io.File", "boolean").implementation = function (arg0, arg1) {
        var ret = this.$init(arg0, arg1);
        var details;
        if (arg0 != null) {
            details = {path: arg0.toPath().toString()};
        }

        var inPackageName = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()).includes('at ' + packageName + '.');
        var sendObj = {type: "filesystem", function: "java.io.FileWriter.$init", thisObjPost: classToHash(this), argTypes: ["java.io.File", "boolean"], args:[classToString(arg0), arg1], returnType: "java.io.FileWriter", returnedObj: classToString(this), isInTargetPackage: inPackageName, details: details};
        send(JSON.stringify(sendObj));
        return ret;
    }

    Java.use("java.io.FileOutputStream").$init.overload("java.io.File", "boolean").implementation = function (arg0, arg1) {
        var ret = this.$init(arg0, arg1);
        var details;
        if (arg0 != null) {
            details = {path: arg0.toPath().toString()};
        }

        var inPackageName = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()).includes('at ' + packageName + '.');
        var sendObj = {type: "filesystem", function: "java.io.FileOutputStream.$init", thisObjPost: classToHash(this), argTypes: ["java.io.File", "boolean"], args:[classToString(arg0), arg1], returnType: "java.io.FileOutputStream", returnedObj: classToString(this), isInTargetPackage: inPackageName, details: details};
        send(JSON.stringify(sendObj));
        return ret;
    }

    Java.use("java.io.FileOutputStream").write.overload("[B", "int", "int").implementation = function (arg0, arg1, arg2) {
        var thisObjPreExec = classToHash(this);
        var ret = this.write(arg0, arg1, arg2);
        var inPackageName = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()).includes('at ' + packageName + '.');
        var sendObj = {type: "filesystem", function: "java.io.FileOutputStream.write", thisObjPre: thisObjPreExec, thisObjPost: classToHash(this), argTypes: ["byte[]", "int", "int"], args:[base64encode(arg0), arg1, arg2], isInTargetPackage: inPackageName};
        send(JSON.stringify(sendObj));
        return ret;
    }

    Java.use("java.io.FileOutputStream").getChannel.overload().implementation = function () {
        var thisObjPreExec = classToHash(this);
        var ret = this.getChannel();
        var inPackageName = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()).includes('at ' + packageName + '.');
        var sendObj = {type: "filesystem", function: "java.io.FileOutputStream.getChannel", thisObjPre: thisObjPreExec, thisObjPost: classToHash(this), returnType: "java.io.FileChannel", returnedObj: classToString(ret), isInTargetPackage: inPackageName};
        send(JSON.stringify(sendObj));
        return ret;
    }

    Java.use("java.io.OutputStreamWriter").$init.overload("java.io.OutputStream", "java.lang.String").implementation = function (arg0, arg1) {
        var ret = this.$init(arg0, arg1);
        var inPackageName = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()).includes('at ' + packageName + '.');
        var sendObj = {type: "filesystem", function: "java.io.OutputStreamWriter.$init", thisObjPost: classToHash(this), argTypes: ["java.io.OutputStream", "java.lang.String"], args:[classToString(arg0), arg1 ? arg1.slice(0, 300) : arg1], returnType: "java.io.OutputStreamWriter", returnedObj: classToString(this), isInTargetPackage: inPackageName};
        send(JSON.stringify(sendObj));
        return ret;
    }

    Java.use("java.io.OutputStreamWriter").$init.overload("java.io.OutputStream").implementation = function (arg0) {
        var ret = this.$init(arg0);
        var inPackageName = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()).includes('at ' + packageName + '.');
        var sendObj = {type: "filesystem", function: "java.io.OutputStreamWriter.$init", thisObjPost: classToHash(this), argTypes: ["java.io.OutputStream"], args:[classToString(arg0)], returnType: "java.io.OutputStreamWriter", returnedObj: classToString(this), isInTargetPackage: inPackageName};
        send(JSON.stringify(sendObj));
        return ret;
    }

    Java.use("java.io.OutputStreamWriter").$init.overload("java.io.OutputStream", "java.nio.charset.Charset").implementation = function (arg0, arg1) {
        var ret = this.$init(arg0, arg1);
        var inPackageName = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()).includes('at ' + packageName + '.');
        var sendObj = {type: "filesystem", function: "java.io.OutputStreamWriter.$init", thisObjPost: classToHash(this), argTypes: ["java.io.OutputStream", "java.nio.charset.Charset"], args:[classToString(arg0), classToString(arg1)], returnType: "java.io.OutputStreamWriter", returnedObj: classToString(this), isInTargetPackage: inPackageName};
        send(JSON.stringify(sendObj));
        return ret;
    }

    Java.use("java.io.OutputStreamWriter").$init.overload("java.io.OutputStream", "java.nio.charset.CharsetEncoder").implementation = function (arg0, arg1) {
        var ret = this.$init(arg0, arg1);
        var inPackageName = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()).includes('at ' + packageName + '.');
        var sendObj = {type: "filesystem", function: "java.io.OutputStreamWriter.$init", thisObjPost: classToHash(this), argTypes: ["java.io.OutputStream", "java.nio.charset.CharsetEncoder"], args:[classToString(arg0), classToString(arg1)], returnType: "java.io.OutputStreamWriter", returnedObj: classToString(this), isInTargetPackage: inPackageName};
        send(JSON.stringify(sendObj));
        return ret;
    }

    Java.use("java.io.OutputStreamWriter").write.overload("int").implementation = function (arg0) {
        var thisObjPreExec = classToHash(this);
        var ret = this.write(arg0);
        var inPackageName = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()).includes('at ' + packageName + '.');
        var sendObj = {type: "filesystem", function: "java.io.OutputStreamWriter.write", thisObjPre: thisObjPreExec, thisObjPost: classToHash(this), argTypes: ["int"], args:[arg0], isInTargetPackage: inPackageName};
        send(JSON.stringify(sendObj));
        return ret;
    }

    Java.use("java.io.OutputStreamWriter").write.overload("java.lang.String", "int", "int").implementation = function (arg0, arg1, arg2) {
        var thisObjPreExec = classToHash(this);
        var ret = this.write(arg0, arg1, arg2);
        var inPackageName = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()).includes('at ' + packageName + '.');
        var sendObj = {type: "filesystem", function: "java.io.OutputStreamWriter.write", thisObjPre: thisObjPreExec, thisObjPost: classToHash(this), argTypes: ["java.lang.String", "int", "int"], args:[arg0 ? arg0.slice(0, 300) : arg0, arg1, arg2], isInTargetPackage: inPackageName};
        send(JSON.stringify(sendObj));
        return ret;
    }

    Java.use("java.io.OutputStreamWriter").write.overload("[C", "int", "int").implementation = function (arg0, arg1, arg2) {
        var thisObjPreExec = classToHash(this);
        var ret = this.write(arg0, arg1, arg2);
        var inPackageName = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()).includes('at ' + packageName + '.');
        var sendObj = {type: "filesystem", function: "java.io.OutputStreamWriter.write", thisObjPre: thisObjPreExec, thisObjPost: classToHash(this), argTypes: ["char[]", "int", "int"], args:[base64encode(arg0), arg1, arg2], isInTargetPackage: inPackageName};
        send(JSON.stringify(sendObj));
        return ret;
    }

    Java.use("java.io.RandomAccessFile").$init.overload("java.io.File", "java.lang.String").implementation = function (arg0, arg1) {
        var ret = this.$init(arg0, arg1);
        var details;
        if (arg0 != null) {
            details = {path: arg0.toPath().toString()};
        }

        var inPackageName = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()).includes('at ' + packageName + '.');
        var sendObj = {type: "filesystem", function: "java.io.RandomAccessFile.$init", thisObjPost: classToHash(this), argTypes: ["java.io.File", "java.lang.String"], args:[classToString(arg0), arg1 ? arg1.slice(0, 300) : arg1], returnType: "java.io.RandomAccessFile", returnedObj: classToString(this), isInTargetPackage: inPackageName, details: details};
        send(JSON.stringify(sendObj));
        return ret;
    }

    Java.use("java.io.RandomAccessFile").writeBytes.overload("[B", "int", "int").implementation = function (arg0, arg1, arg2) {
        var thisObjPreExec = classToHash(this);
        var ret = this.writeBytes(arg0, arg1, arg2);
        var inPackageName = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()).includes('at ' + packageName + '.');
        var sendObj = {type: "filesystem", function: "java.io.RandomAccessFile.writeBytes", thisObjPre: thisObjPreExec, thisObjPost: classToHash(this), argTypes: ["byte[]", "int", "int"], args:[base64encode(arg0), arg1, arg2], isInTargetPackage: inPackageName};
        send(JSON.stringify(sendObj));
        return ret;
    }

    Java.use("java.io.RandomAccessFile").readBytes.overload("[B", "int", "int").implementation = function (arg0, arg1, arg2) {
        var thisObjPreExec = classToHash(this);
        var ret = this.readBytes(arg0, arg1, arg2);
        var inPackageName = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()).includes('at ' + packageName + '.');
        var sendObj = {type: "filesystem", function: "java.io.RandomAccessFile.readBytes", thisObjPre: thisObjPreExec, thisObjPost: classToHash(this), argTypes: ["byte[]", "int", "int"], args:[base64encode(arg0), arg1, arg2], returnType: "int", returnedObj: ret, isInTargetPackage: inPackageName};
        send(JSON.stringify(sendObj));
        return ret;
    }

    Java.use("java.io.RandomAccessFile").getChannel.overload().implementation = function () {
        var thisObjPreExec = classToHash(this);
        var ret = this.getChannel();
        var inPackageName = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()).includes('at ' + packageName + '.');
        var sendObj = {type: "filesystem", function: "java.io.RandomAccessFile.getChannel", thisObjPre: thisObjPreExec, thisObjPost: classToHash(this), returnType: "java.io.FileChannel", returnedObj: classToString(ret), isInTargetPackage: inPackageName};
        send(JSON.stringify(sendObj));
        return ret;
    }

    Java.use("android.os.Process").start.overload("java.lang.String", "java.lang.String", "int", "int", "[I", "int", "int", "int", "java.lang.String", "java.lang.String", "java.lang.String", "java.lang.String", "java.lang.String", "java.lang.String", "int", "boolean", "[J", "java.util.Map", "java.util.Map", "boolean", "boolean", "[Ljava.lang.String;").implementation = function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10, arg11, arg12, arg13, arg14, arg15, arg16, arg17, arg18, arg19, arg20, arg21) {
        var thisObjPreExec = classToHash(this);
        var ret = this.start(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10, arg11, arg12, arg13, arg14, arg15, arg16, arg17, arg18, arg19, arg20, arg21);
        var inPackageName = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()).includes('at ' + packageName + '.');
        var sendObj = {type: "filesystem", function: "android.os.Process.start", thisObjPre: thisObjPreExec, thisObjPost: classToHash(this), argTypes: ["java.lang.String", "java.lang.String", "int", "int", "int[]", "int", "int", "int", "java.lang.String", "java.lang.String", "java.lang.String", "java.lang.String", "java.lang.String", "java.lang.String", "int", "boolean", "long[]", "java.util.Map", "java.util.Map", "boolean", "boolean", "java.lang.String[]"], args:[arg0 ? arg0.slice(0, 300) : arg0, arg1 ? arg1.slice(0, 300) : arg1, arg2, arg3, base64encode(arg4), arg5, arg6, arg7, arg8 ? arg8.slice(0, 300) : arg8, arg9 ? arg9.slice(0, 300) : arg9, arg10 ? arg10.slice(0, 300) : arg10, arg11 ? arg11.slice(0, 300) : arg11, arg12 ? arg12.slice(0, 300) : arg12, arg13 ? arg13.slice(0, 300) : arg13, arg14, arg15, base64encode(arg16), classToString(arg17), classToString(arg18), arg19, arg20, classToString(arg21)], returnType: "android.os.Process$ProcessStartResult", returnedObj: classToString(ret), isInTargetPackage: inPackageName};
        send(JSON.stringify(sendObj));
        return ret;
    }

    Java.use("android.os.Process").startWebView.overload("java.lang.String", "java.lang.String", "int", "int", "[I", "int", "int", "int", "java.lang.String", "java.lang.String", "java.lang.String", "java.lang.String", "java.lang.String", "java.lang.String", "[J", "[Ljava.lang.String;").implementation = function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10, arg11, arg12, arg13, arg14, arg15) {
        var thisObjPreExec = classToHash(this);
        var ret = this.startWebView(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10, arg11, arg12, arg13, arg14, arg15);
        var inPackageName = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()).includes('at ' + packageName + '.');
        var sendObj = {type: "filesystem", function: "android.os.Process.startWebView", thisObjPre: thisObjPreExec, thisObjPost: classToHash(this), argTypes: ["java.lang.String", "java.lang.String", "int", "int", "int[]", "int", "int", "int", "java.lang.String", "java.lang.String", "java.lang.String", "java.lang.String", "java.lang.String", "java.lang.String", "long[]", "java.lang.String[]"], args:[arg0 ? arg0.slice(0, 300) : arg0, arg1 ? arg1.slice(0, 300) : arg1, arg2, arg3, base64encode(arg4), arg5, arg6, arg7, arg8 ? arg8.slice(0, 300) : arg8, arg9 ? arg9.slice(0, 300) : arg9, arg10 ? arg10.slice(0, 300) : arg10, arg11 ? arg11.slice(0, 300) : arg11, arg12 ? arg12.slice(0, 300) : arg12, arg13 ? arg13.slice(0, 300) : arg13, base64encode(arg14), classToString(arg15)], returnType: "android.os.Process$ProcessStartResult", returnedObj: classToString(ret), isInTargetPackage: inPackageName};
        send(JSON.stringify(sendObj));
        return ret;
    }

    Java.use("android.os.Process").killProcess.overload("int").implementation = function (arg0) {
        var thisObjPreExec = classToHash(this);
        var ret = this.killProcess(arg0);
        var inPackageName = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()).includes('at ' + packageName + '.');
        var sendObj = {type: "filesystem", function: "android.os.Process.killProcess", thisObjPre: thisObjPreExec, thisObjPost: classToHash(this), argTypes: ["int"], args:[arg0], isInTargetPackage: inPackageName};
        send(JSON.stringify(sendObj));
        return ret;
    }

    Java.use("java.lang.ProcessBuilder").$init.overload("java.util.List").implementation = function (arg0) {
        var ret = this.$init(arg0);
        var inPackageName = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()).includes('at ' + packageName + '.');
        var sendObj = {type: "filesystem", function: "java.lang.ProcessBuilder.$init", thisObjPost: classToHash(this), argTypes: ["java.util.List"], args:[classToString(arg0)], returnType: "java.lang.ProcessBuilder", returnedObj: classToString(this), isInTargetPackage: inPackageName};
        send(JSON.stringify(sendObj));
        return ret;
    }

    Java.use("java.lang.ProcessBuilder").$init.overload("[Ljava.lang.String;").implementation = function (arg0) {
        var ret = this.$init(arg0);
        var inPackageName = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()).includes('at ' + packageName + '.');
        var sendObj = {type: "filesystem", function: "java.lang.ProcessBuilder.$init", thisObjPost: classToHash(this), argTypes: ["java.lang.String..."], args:[classToString(arg0)], returnType: "java.lang.ProcessBuilder", returnedObj: classToString(this), isInTargetPackage: inPackageName};
        send(JSON.stringify(sendObj));
        return ret;
    }

    Java.use("java.lang.ProcessBuilder").command.overload("[Ljava.lang.String;").implementation = function (arg0) {
        var thisObjPreExec = classToHash(this);
        var ret = this.command(arg0);
        var inPackageName = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()).includes('at ' + packageName + '.');
        var sendObj = {type: "filesystem", function: "java.lang.ProcessBuilder.command", thisObjPre: thisObjPreExec, thisObjPost: classToHash(this), argTypes: ["java.lang.String..."], args:[classToString(arg0)], returnType: "java.lang.ProcessBuilder", returnedObj: classToString(ret), isInTargetPackage: inPackageName};
        send(JSON.stringify(sendObj));
        return ret;
    }

    Java.use("java.lang.ProcessBuilder").command.overload("java.util.List").implementation = function (arg0) {
        var thisObjPreExec = classToHash(this);
        var ret = this.command(arg0);
        var inPackageName = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()).includes('at ' + packageName + '.');
        var sendObj = {type: "filesystem", function: "java.lang.ProcessBuilder.command", thisObjPre: thisObjPreExec, thisObjPost: classToHash(this), argTypes: ["java.util.List"], args:[classToString(arg0)], returnType: "java.lang.ProcessBuilder", returnedObj: classToString(ret), isInTargetPackage: inPackageName};
        send(JSON.stringify(sendObj));
        return ret;
    }

    Java.use("java.lang.ProcessBuilder").start.overload().implementation = function () {
        var thisObjPreExec = classToHash(this);
        var ret = this.start();
        var inPackageName = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()).includes('at ' + packageName + '.');
        var sendObj = {type: "filesystem", function: "java.lang.ProcessBuilder.start", thisObjPre: thisObjPreExec, thisObjPost: classToHash(this), returnType: "android.os.Process", returnedObj: classToString(ret), isInTargetPackage: inPackageName};
        send(JSON.stringify(sendObj));
        return ret;
    }

    Java.use("java.lang.Runtime").exec.overload("[Ljava.lang.String;").implementation = function (arg0) {
        var thisObjPreExec = classToHash(this);
        var ret = this.exec(arg0);
        var inPackageName = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()).includes('at ' + packageName + '.');
        var sendObj = {type: "filesystem", function: "java.lang.Runtime.exec", thisObjPre: thisObjPreExec, thisObjPost: classToHash(this), argTypes: ["java.lang.String[]"], args:[classToString(arg0)], returnType: "android.os.Process", returnedObj: classToString(ret), isInTargetPackage: inPackageName};
        send(JSON.stringify(sendObj));
        return ret;
    }

    Java.use("java.lang.Runtime").exec.overload("[Ljava.lang.String;", "[Ljava.lang.String;").implementation = function (arg0, arg1) {
        var thisObjPreExec = classToHash(this);
        var ret = this.exec(arg0, arg1);
        var inPackageName = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()).includes('at ' + packageName + '.');
        var sendObj = {type: "filesystem", function: "java.lang.Runtime.exec", thisObjPre: thisObjPreExec, thisObjPost: classToHash(this), argTypes: ["java.lang.String[]", "java.lang.String[]"], args:[classToString(arg0), classToString(arg1)], returnType: "android.os.Process", returnedObj: classToString(ret), isInTargetPackage: inPackageName};
        send(JSON.stringify(sendObj));
        return ret;
    }

    Java.use("java.lang.Runtime").exec.overload("java.lang.String").implementation = function (arg0) {
        var thisObjPreExec = classToHash(this);
        var ret = this.exec(arg0);
        var inPackageName = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()).includes('at ' + packageName + '.');
        var sendObj = {type: "filesystem", function: "java.lang.Runtime.exec", thisObjPre: thisObjPreExec, thisObjPost: classToHash(this), argTypes: ["java.lang.String"], args:[arg0 ? arg0.slice(0, 300) : arg0], returnType: "android.os.Process", returnedObj: classToString(ret), isInTargetPackage: inPackageName};
        send(JSON.stringify(sendObj));
        return ret;
    }

    Java.use("java.lang.Runtime").exec.overload("java.lang.String", "[Ljava.lang.String;").implementation = function (arg0, arg1) {
        var thisObjPreExec = classToHash(this);
        var ret = this.exec(arg0, arg1);
        var inPackageName = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()).includes('at ' + packageName + '.');
        var sendObj = {type: "filesystem", function: "java.lang.Runtime.exec", thisObjPre: thisObjPreExec, thisObjPost: classToHash(this), argTypes: ["java.lang.String", "java.lang.String[]"], args:[arg0 ? arg0.slice(0, 300) : arg0, classToString(arg1)], returnType: "android.os.Process", returnedObj: classToString(ret), isInTargetPackage: inPackageName};
        send(JSON.stringify(sendObj));
        return ret;
    }

    Java.use("java.lang.Runtime").exec.overload("[Ljava.lang.String;", "[Ljava.lang.String;", "java.io.File").implementation = function (arg0, arg1, arg2) {
        var thisObjPreExec = classToHash(this);
        var ret = this.exec(arg0, arg1, arg2);
        var inPackageName = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()).includes('at ' + packageName + '.');
        var sendObj = {type: "filesystem", function: "java.lang.Runtime.exec", thisObjPre: thisObjPreExec, thisObjPost: classToHash(this), argTypes: ["java.lang.String[]", "java.lang.String[]", "java.io.File"], args:[classToString(arg0), classToString(arg1), classToString(arg2)], returnType: "android.os.Process", returnedObj: classToString(ret), isInTargetPackage: inPackageName};
        send(JSON.stringify(sendObj));
        return ret;
    }

    Java.use("java.lang.Runtime").exec.overload("java.lang.String", "[Ljava.lang.String;", "java.io.File").implementation = function (arg0, arg1, arg2) {
        var thisObjPreExec = classToHash(this);
        var ret = this.exec(arg0, arg1, arg2);
        var inPackageName = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()).includes('at ' + packageName + '.');
        var sendObj = {type: "filesystem", function: "java.lang.Runtime.exec", thisObjPre: thisObjPreExec, thisObjPost: classToHash(this), argTypes: ["java.lang.String", "java.lang.String[]", "java.io.File"], args:[arg0 ? arg0.slice(0, 300) : arg0, classToString(arg1), classToString(arg2)], returnType: "android.os.Process", returnedObj: classToString(ret), isInTargetPackage: inPackageName};
        send(JSON.stringify(sendObj));
        return ret;
    }

    Java.use("android.content.ContextWrapper").checkCallingOrSelfPermission.overload("java.lang.String").implementation = function (arg0) {
        var thisObjPreExec = classToHash(this);
        var ret = this.checkCallingOrSelfPermission(arg0);
        var inPackageName = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()).includes('at ' + packageName + '.');
        var sendObj = {type: "filesystem", function: "android.content.ContextWrapper.checkCallingOrSelfPermission", thisObjPre: thisObjPreExec, thisObjPost: classToHash(this), argTypes: ["java.lang.String"], args:[arg0 ? arg0.slice(0, 300) : arg0], returnType: "int", returnedObj: ret, isInTargetPackage: inPackageName};
        send(JSON.stringify(sendObj));
        return ret;
    }

    Java.use("android.content.ContextWrapper").checkCallingOrSelfUriPermission.overload("android.net.Uri", "int").implementation = function (arg0, arg1) {
        var thisObjPreExec = classToHash(this);
        var ret = this.checkCallingOrSelfUriPermission(arg0, arg1);
        var inPackageName = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()).includes('at ' + packageName + '.');
        var sendObj = {type: "filesystem", function: "android.content.ContextWrapper.checkCallingOrSelfUriPermission", thisObjPre: thisObjPreExec, thisObjPost: classToHash(this), argTypes: ["android.net.Uri", "int"], args:[classToString(arg0), arg1], returnType: "int", returnedObj: ret, isInTargetPackage: inPackageName};
        send(JSON.stringify(sendObj));
        return ret;
    }

    Java.use("android.content.ContextWrapper").checkCallingPermission.overload("java.lang.String").implementation = function (arg0) {
        var thisObjPreExec = classToHash(this);
        var ret = this.checkCallingPermission(arg0);
        var inPackageName = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()).includes('at ' + packageName + '.');
        var sendObj = {type: "filesystem", function: "android.content.ContextWrapper.checkCallingPermission", thisObjPre: thisObjPreExec, thisObjPost: classToHash(this), argTypes: ["java.lang.String"], args:[arg0 ? arg0.slice(0, 300) : arg0], returnType: "int", returnedObj: ret, isInTargetPackage: inPackageName};
        send(JSON.stringify(sendObj));
        return ret;
    }

    Java.use("android.content.ContextWrapper").checkCallingUriPermission.overload("android.net.Uri", "int").implementation = function (arg0, arg1) {
        var thisObjPreExec = classToHash(this);
        var ret = this.checkCallingUriPermission(arg0, arg1);
        var inPackageName = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()).includes('at ' + packageName + '.');
        var sendObj = {type: "filesystem", function: "android.content.ContextWrapper.checkCallingUriPermission", thisObjPre: thisObjPreExec, thisObjPost: classToHash(this), argTypes: ["android.net.Uri", "int"], args:[classToString(arg0), arg1], returnType: "int", returnedObj: ret, isInTargetPackage: inPackageName};
        send(JSON.stringify(sendObj));
        return ret;
    }

    Java.use("android.content.ContextWrapper").checkPermission.overload("java.lang.String", "int", "int").implementation = function (arg0, arg1, arg2) {
        var thisObjPreExec = classToHash(this);
        var ret = this.checkPermission(arg0, arg1, arg2);
        var inPackageName = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()).includes('at ' + packageName + '.');
        var sendObj = {type: "filesystem", function: "android.content.ContextWrapper.checkPermission", thisObjPre: thisObjPreExec, thisObjPost: classToHash(this), argTypes: ["java.lang.String", "int", "int"], args:[arg0 ? arg0.slice(0, 300) : arg0, arg1, arg2], returnType: "int", returnedObj: ret, isInTargetPackage: inPackageName};
        send(JSON.stringify(sendObj));
        return ret;
    }

    Java.use("android.content.ContextWrapper").checkSelfPermission.overload("java.lang.String").implementation = function (arg0) {
        var thisObjPreExec = classToHash(this);
        var ret = this.checkSelfPermission(arg0);
        var inPackageName = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()).includes('at ' + packageName + '.');
        var sendObj = {type: "filesystem", function: "android.content.ContextWrapper.checkSelfPermission", thisObjPre: thisObjPreExec, thisObjPost: classToHash(this), argTypes: ["java.lang.String"], args:[arg0 ? arg0.slice(0, 300) : arg0], returnType: "int", returnedObj: ret, isInTargetPackage: inPackageName};
        send(JSON.stringify(sendObj));
        return ret;
    }

    Java.use("android.content.ContextWrapper").checkUriPermission.overload("android.net.Uri", "java.lang.String", "java.lang.String", "int", "int", "int").implementation = function (arg0, arg1, arg2, arg3, arg4, arg5) {
        var thisObjPreExec = classToHash(this);
        var ret = this.checkUriPermission(arg0, arg1, arg2, arg3, arg4, arg5);
        var inPackageName = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()).includes('at ' + packageName + '.');
        var sendObj = {type: "filesystem", function: "android.content.ContextWrapper.checkUriPermission", thisObjPre: thisObjPreExec, thisObjPost: classToHash(this), argTypes: ["android.net.Uri", "java.lang.String", "java.lang.String", "int", "int", "int"], args:[classToString(arg0), arg1 ? arg1.slice(0, 300) : arg1, arg2 ? arg2.slice(0, 300) : arg2, arg3, arg4, arg5], returnType: "int", returnedObj: ret, isInTargetPackage: inPackageName};
        send(JSON.stringify(sendObj));
        return ret;
    }

    Java.use("android.content.ContextWrapper").checkUriPermission.overload("android.net.Uri", "int", "int", "int").implementation = function (arg0, arg1, arg2, arg3) {
        var thisObjPreExec = classToHash(this);
        var ret = this.checkUriPermission(arg0, arg1, arg2, arg3);
        var inPackageName = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()).includes('at ' + packageName + '.');
        var sendObj = {type: "filesystem", function: "android.content.ContextWrapper.checkUriPermission", thisObjPre: thisObjPreExec, thisObjPost: classToHash(this), argTypes: ["android.net.Uri", "int", "int", "int"], args:[classToString(arg0), arg1, arg2, arg3], returnType: "int", returnedObj: ret, isInTargetPackage: inPackageName};
        send(JSON.stringify(sendObj));
        return ret;
    }

    Java.use("android.content.ContextWrapper").grantUriPermission.overload("java.lang.String", "android.net.Uri", "int").implementation = function (arg0, arg1, arg2) {
        var thisObjPreExec = classToHash(this);
        var ret = this.grantUriPermission(arg0, arg1, arg2);
        var inPackageName = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()).includes('at ' + packageName + '.');
        var sendObj = {type: "filesystem", function: "android.content.ContextWrapper.grantUriPermission", thisObjPre: thisObjPreExec, thisObjPost: classToHash(this), argTypes: ["java.lang.String", "android.net.Uri", "int"], args:[arg0 ? arg0.slice(0, 300) : arg0, classToString(arg1), arg2], isInTargetPackage: inPackageName};
        send(JSON.stringify(sendObj));
        return ret;
    }

    Java.use("android.content.ContextWrapper").registerReceiver.overload("android.content.BroadcastReceiver", "android.content.IntentFilter").implementation = function (arg0, arg1) {
        var thisObjPreExec = classToHash(this);
        var ret = this.registerReceiver(arg0, arg1);
        var inPackageName = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()).includes('at ' + packageName + '.');
        var sendObj = {type: "filesystem", function: "android.content.ContextWrapper.registerReceiver", thisObjPre: thisObjPreExec, thisObjPost: classToHash(this), argTypes: ["android.content.BroadcastReceiver", "android.content.IntentFilter"], args:[classToString(arg0), classToString(arg1)], returnType: "android.content.Intent", returnedObj: classToString(ret), isInTargetPackage: inPackageName};
        send(JSON.stringify(sendObj));
        return ret;
    }

    Java.use("android.content.ContextWrapper").registerReceiver.overload("android.content.BroadcastReceiver", "android.content.IntentFilter", "int").implementation = function (arg0, arg1, arg2) {
        var thisObjPreExec = classToHash(this);
        var ret = this.registerReceiver(arg0, arg1, arg2);
        var inPackageName = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()).includes('at ' + packageName + '.');
        var sendObj = {type: "filesystem", function: "android.content.ContextWrapper.registerReceiver", thisObjPre: thisObjPreExec, thisObjPost: classToHash(this), argTypes: ["android.content.BroadcastReceiver", "android.content.IntentFilter", "int"], args:[classToString(arg0), classToString(arg1), arg2], returnType: "android.content.Intent", returnedObj: classToString(ret), isInTargetPackage: inPackageName};
        send(JSON.stringify(sendObj));
        return ret;
    }

    Java.use("android.content.ContextWrapper").registerReceiver.overload("android.content.BroadcastReceiver", "android.content.IntentFilter", "java.lang.String", "android.os.Handler", "int").implementation = function (arg0, arg1, arg2, arg3, arg4) {
        var thisObjPreExec = classToHash(this);
        var ret = this.registerReceiver(arg0, arg1, arg2, arg3, arg4);
        var inPackageName = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()).includes('at ' + packageName + '.');
        var sendObj = {type: "filesystem", function: "android.content.ContextWrapper.registerReceiver", thisObjPre: thisObjPreExec, thisObjPost: classToHash(this), argTypes: ["android.content.BroadcastReceiver", "android.content.IntentFilter", "java.lang.String", "android.os.Handler", "int"], args:[classToString(arg0), classToString(arg1), arg2 ? arg2.slice(0, 300) : arg2, classToString(arg3), arg4], returnType: "android.content.Intent", returnedObj: classToString(ret), isInTargetPackage: inPackageName};
        send(JSON.stringify(sendObj));
        return ret;
    }

    Java.use("android.content.ContextWrapper").registerReceiver.overload("android.content.BroadcastReceiver", "android.content.IntentFilter", "java.lang.String", "android.os.Handler").implementation = function (arg0, arg1, arg2, arg3) {
        var thisObjPreExec = classToHash(this);
        var ret = this.registerReceiver(arg0, arg1, arg2, arg3);
        var inPackageName = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()).includes('at ' + packageName + '.');
        var sendObj = {type: "filesystem", function: "android.content.ContextWrapper.registerReceiver", thisObjPre: thisObjPreExec, thisObjPost: classToHash(this), argTypes: ["android.content.BroadcastReceiver", "android.content.IntentFilter", "java.lang.String", "android.os.Handler"], args:[classToString(arg0), classToString(arg1), arg2 ? arg2.slice(0, 300) : arg2, classToString(arg3)], returnType: "android.content.Intent", returnedObj: classToString(ret), isInTargetPackage: inPackageName};
        send(JSON.stringify(sendObj));
        return ret;
    }

    Java.use("android.content.ContextWrapper").sendBroadcast.overload("android.content.Intent", "java.lang.String").implementation = function (arg0, arg1) {
        var thisObjPreExec = classToHash(this);
        var ret = this.sendBroadcast(arg0, arg1);
        var details;
        if (arg0 != null) {
            var cat = [];
            var it = arg0.getCategories()?.iterator();
            while(it != null && it.hasNext()) {
                cat.push(it.next());
            }
            details = {extras: arg0.getExtras()?.toString(), flags: arg0.getFlags(), type: arg0.getType(), categories: JSON.stringify(cat), action: arg0.getAction()};
        }

        var inPackageName = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()).includes('at ' + packageName + '.');
        var sendObj = {type: "filesystem", function: "android.content.ContextWrapper.sendBroadcast", thisObjPre: thisObjPreExec, thisObjPost: classToHash(this), argTypes: ["android.content.Intent", "java.lang.String"], args:[classToString(arg0), arg1 ? arg1.slice(0, 300) : arg1], isInTargetPackage: inPackageName, details: details};
        send(JSON.stringify(sendObj));
        return ret;
    }

    Java.use("android.content.ContextWrapper").sendBroadcast.overload("android.content.Intent").implementation = function (arg0) {
        var thisObjPreExec = classToHash(this);
        var ret = this.sendBroadcast(arg0);
        var details;
        if (arg0 != null) {
            var cat = [];
            var it = arg0.getCategories()?.iterator();
            while(it != null && it.hasNext()) {
                cat.push(it.next());
            }
            details = {extras: arg0.getExtras()?.toString(), flags: arg0.getFlags(), type: arg0.getType(), categories: JSON.stringify(cat), action: arg0.getAction()};
        }

        var inPackageName = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()).includes('at ' + packageName + '.');
        var sendObj = {type: "filesystem", function: "android.content.ContextWrapper.sendBroadcast", thisObjPre: thisObjPreExec, thisObjPost: classToHash(this), argTypes: ["android.content.Intent"], args:[classToString(arg0)], isInTargetPackage: inPackageName, details: details};
        send(JSON.stringify(sendObj));
        return ret;
    }

    Java.use("android.content.ContextWrapper").sendBroadcastAsUser.overload("android.content.Intent", "android.os.UserHandle").implementation = function (arg0, arg1) {
        var thisObjPreExec = classToHash(this);
        var ret = this.sendBroadcastAsUser(arg0, arg1);
        var details;
        if (arg0 != null) {
            var cat = [];
            var it = arg0.getCategories()?.iterator();
            while(it != null && it.hasNext()) {
                cat.push(it.next());
            }
            details = {extras: arg0.getExtras()?.toString(), flags: arg0.getFlags(), type: arg0.getType(), categories: JSON.stringify(cat), action: arg0.getAction()};
        }

        var inPackageName = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()).includes('at ' + packageName + '.');
        var sendObj = {type: "filesystem", function: "android.content.ContextWrapper.sendBroadcastAsUser", thisObjPre: thisObjPreExec, thisObjPost: classToHash(this), argTypes: ["android.content.Intent", "android.os.UserHandle"], args:[classToString(arg0), classToString(arg1)], isInTargetPackage: inPackageName, details: details};
        send(JSON.stringify(sendObj));
        return ret;
    }

    Java.use("android.content.ContextWrapper").sendBroadcastAsUser.overload("android.content.Intent", "android.os.UserHandle", "java.lang.String").implementation = function (arg0, arg1, arg2) {
        var thisObjPreExec = classToHash(this);
        var ret = this.sendBroadcastAsUser(arg0, arg1, arg2);
        var details;
        if (arg0 != null) {
            var cat = [];
            var it = arg0.getCategories()?.iterator();
            while(it != null && it.hasNext()) {
                cat.push(it.next());
            }
            details = {extras: arg0.getExtras()?.toString(), flags: arg0.getFlags(), type: arg0.getType(), categories: JSON.stringify(cat), action: arg0.getAction()};
        }

        var inPackageName = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()).includes('at ' + packageName + '.');
        var sendObj = {type: "filesystem", function: "android.content.ContextWrapper.sendBroadcastAsUser", thisObjPre: thisObjPreExec, thisObjPost: classToHash(this), argTypes: ["android.content.Intent", "android.os.UserHandle", "java.lang.String"], args:[classToString(arg0), classToString(arg1), arg2 ? arg2.slice(0, 300) : arg2], isInTargetPackage: inPackageName, details: details};
        send(JSON.stringify(sendObj));
        return ret;
    }

    Java.use("android.content.ContextWrapper").sendOrderedBroadcast.overload("android.content.Intent", "java.lang.String", "java.lang.String", "android.content.BroadcastReceiver", "android.os.Handler", "int", "java.lang.String", "android.os.Bundle").implementation = function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7) {
        var thisObjPreExec = classToHash(this);
        var ret = this.sendOrderedBroadcast(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7);
        var details;
        if (arg0 != null) {
            var cat = [];
            var it = arg0.getCategories()?.iterator();
            while(it != null && it.hasNext()) {
                cat.push(it.next());
            }
            details = {extras: arg0.getExtras()?.toString(), flags: arg0.getFlags(), type: arg0.getType(), categories: JSON.stringify(cat), action: arg0.getAction()};
        }

        var inPackageName = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()).includes('at ' + packageName + '.');
        var sendObj = {type: "filesystem", function: "android.content.ContextWrapper.sendOrderedBroadcast", thisObjPre: thisObjPreExec, thisObjPost: classToHash(this), argTypes: ["android.content.Intent", "java.lang.String", "java.lang.String", "android.content.BroadcastReceiver", "android.os.Handler", "int", "java.lang.String", "android.os.Bundle"], args:[classToString(arg0), arg1 ? arg1.slice(0, 300) : arg1, arg2 ? arg2.slice(0, 300) : arg2, classToString(arg3), classToString(arg4), arg5, arg6 ? arg6.slice(0, 300) : arg6, classToString(arg7)], isInTargetPackage: inPackageName, details: details};
        send(JSON.stringify(sendObj));
        return ret;
    }

    Java.use("android.content.ContextWrapper").sendOrderedBroadcast.overload("android.content.Intent", "int", "java.lang.String", "java.lang.String", "android.content.BroadcastReceiver", "android.os.Handler", "java.lang.String", "android.os.Bundle", "android.os.Bundle").implementation = function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8) {
        var thisObjPreExec = classToHash(this);
        var ret = this.sendOrderedBroadcast(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8);
        var details;
        if (arg0 != null) {
            var cat = [];
            var it = arg0.getCategories()?.iterator();
            while(it != null && it.hasNext()) {
                cat.push(it.next());
            }
            details = {extras: arg0.getExtras()?.toString(), flags: arg0.getFlags(), type: arg0.getType(), categories: JSON.stringify(cat), action: arg0.getAction()};
        }

        var inPackageName = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()).includes('at ' + packageName + '.');
        var sendObj = {type: "filesystem", function: "android.content.ContextWrapper.sendOrderedBroadcast", thisObjPre: thisObjPreExec, thisObjPost: classToHash(this), argTypes: ["android.content.Intent", "int", "java.lang.String", "java.lang.String", "android.content.BroadcastReceiver", "android.os.Handler", "java.lang.String", "android.os.Bundle", "android.os.Bundle"], args:[classToString(arg0), arg1, arg2 ? arg2.slice(0, 300) : arg2, arg3 ? arg3.slice(0, 300) : arg3, classToString(arg4), classToString(arg5), arg6 ? arg6.slice(0, 300) : arg6, classToString(arg7), classToString(arg8)], isInTargetPackage: inPackageName, details: details};
        send(JSON.stringify(sendObj));
        return ret;
    }

    Java.use("android.content.ContextWrapper").sendOrderedBroadcast.overload("android.content.Intent", "java.lang.String", "android.content.BroadcastReceiver", "android.os.Handler", "int", "java.lang.String", "android.os.Bundle").implementation = function (arg0, arg1, arg2, arg3, arg4, arg5, arg6) {
        var thisObjPreExec = classToHash(this);
        var ret = this.sendOrderedBroadcast(arg0, arg1, arg2, arg3, arg4, arg5, arg6);
        var details;
        if (arg0 != null) {
            var cat = [];
            var it = arg0.getCategories()?.iterator();
            while(it != null && it.hasNext()) {
                cat.push(it.next());
            }
            details = {extras: arg0.getExtras()?.toString(), flags: arg0.getFlags(), type: arg0.getType(), categories: JSON.stringify(cat), action: arg0.getAction()};
        }

        var inPackageName = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()).includes('at ' + packageName + '.');
        var sendObj = {type: "filesystem", function: "android.content.ContextWrapper.sendOrderedBroadcast", thisObjPre: thisObjPreExec, thisObjPost: classToHash(this), argTypes: ["android.content.Intent", "java.lang.String", "android.content.BroadcastReceiver", "android.os.Handler", "int", "java.lang.String", "android.os.Bundle"], args:[classToString(arg0), arg1 ? arg1.slice(0, 300) : arg1, classToString(arg2), classToString(arg3), arg4, arg5 ? arg5.slice(0, 300) : arg5, classToString(arg6)], isInTargetPackage: inPackageName, details: details};
        send(JSON.stringify(sendObj));
        return ret;
    }

    Java.use("android.content.ContextWrapper").sendOrderedBroadcast.overload("android.content.Intent", "java.lang.String").implementation = function (arg0, arg1) {
        var thisObjPreExec = classToHash(this);
        var ret = this.sendOrderedBroadcast(arg0, arg1);
        var details;
        if (arg0 != null) {
            var cat = [];
            var it = arg0.getCategories()?.iterator();
            while(it != null && it.hasNext()) {
                cat.push(it.next());
            }
            details = {extras: arg0.getExtras()?.toString(), flags: arg0.getFlags(), type: arg0.getType(), categories: JSON.stringify(cat), action: arg0.getAction()};
        }

        var inPackageName = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()).includes('at ' + packageName + '.');
        var sendObj = {type: "filesystem", function: "android.content.ContextWrapper.sendOrderedBroadcast", thisObjPre: thisObjPreExec, thisObjPost: classToHash(this), argTypes: ["android.content.Intent", "java.lang.String"], args:[classToString(arg0), arg1 ? arg1.slice(0, 300) : arg1], isInTargetPackage: inPackageName, details: details};
        send(JSON.stringify(sendObj));
        return ret;
    }

    Java.use("android.content.ContextWrapper").sendOrderedBroadcastAsUser.overload("android.content.Intent", "android.os.UserHandle", "java.lang.String", "android.content.BroadcastReceiver", "android.os.Handler", "int", "java.lang.String", "android.os.Bundle").implementation = function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7) {
        var thisObjPreExec = classToHash(this);
        var ret = this.sendOrderedBroadcastAsUser(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7);
        var details;
        if (arg0 != null) {
            var cat = [];
            var it = arg0.getCategories()?.iterator();
            while(it != null && it.hasNext()) {
                cat.push(it.next());
            }
            details = {extras: arg0.getExtras()?.toString(), flags: arg0.getFlags(), type: arg0.getType(), categories: JSON.stringify(cat), action: arg0.getAction()};
        }

        var inPackageName = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()).includes('at ' + packageName + '.');
        var sendObj = {type: "filesystem", function: "android.content.ContextWrapper.sendOrderedBroadcastAsUser", thisObjPre: thisObjPreExec, thisObjPost: classToHash(this), argTypes: ["android.content.Intent", "android.os.UserHandle", "java.lang.String", "android.content.BroadcastReceiver", "android.os.Handler", "int", "java.lang.String", "android.os.Bundle"], args:[classToString(arg0), classToString(arg1), arg2 ? arg2.slice(0, 300) : arg2, classToString(arg3), classToString(arg4), arg5, arg6 ? arg6.slice(0, 300) : arg6, classToString(arg7)], isInTargetPackage: inPackageName, details: details};
        send(JSON.stringify(sendObj));
        return ret;
    }

    Java.use("android.content.ContextWrapper").sendStickyBroadcast.overload("android.content.Intent").implementation = function (arg0) {
        var thisObjPreExec = classToHash(this);
        var ret = this.sendStickyBroadcast(arg0);
        var details;
        if (arg0 != null) {
            var cat = [];
            var it = arg0.getCategories()?.iterator();
            while(it != null && it.hasNext()) {
                cat.push(it.next());
            }
            details = {extras: arg0.getExtras()?.toString(), flags: arg0.getFlags(), type: arg0.getType(), categories: JSON.stringify(cat), action: arg0.getAction()};
        }

        var inPackageName = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()).includes('at ' + packageName + '.');
        var sendObj = {type: "filesystem", function: "android.content.ContextWrapper.sendStickyBroadcast", thisObjPre: thisObjPreExec, thisObjPost: classToHash(this), argTypes: ["android.content.Intent"], args:[classToString(arg0)], isInTargetPackage: inPackageName, details: details};
        send(JSON.stringify(sendObj));
        return ret;
    }

    Java.use("android.content.ContextWrapper").sendStickyBroadcastAsUser.overload("android.content.Intent", "android.os.UserHandle").implementation = function (arg0, arg1) {
        var thisObjPreExec = classToHash(this);
        var ret = this.sendStickyBroadcastAsUser(arg0, arg1);
        var details;
        if (arg0 != null) {
            var cat = [];
            var it = arg0.getCategories()?.iterator();
            while(it != null && it.hasNext()) {
                cat.push(it.next());
            }
            details = {extras: arg0.getExtras()?.toString(), flags: arg0.getFlags(), type: arg0.getType(), categories: JSON.stringify(cat), action: arg0.getAction()};
        }

        var inPackageName = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()).includes('at ' + packageName + '.');
        var sendObj = {type: "filesystem", function: "android.content.ContextWrapper.sendStickyBroadcastAsUser", thisObjPre: thisObjPreExec, thisObjPost: classToHash(this), argTypes: ["android.content.Intent", "android.os.UserHandle"], args:[classToString(arg0), classToString(arg1)], isInTargetPackage: inPackageName, details: details};
        send(JSON.stringify(sendObj));
        return ret;
    }

    Java.use("android.content.ContextWrapper").sendStickyOrderedBroadcast.overload("android.content.Intent", "android.content.BroadcastReceiver", "android.os.Handler", "int", "java.lang.String", "android.os.Bundle").implementation = function (arg0, arg1, arg2, arg3, arg4, arg5) {
        var thisObjPreExec = classToHash(this);
        var ret = this.sendStickyOrderedBroadcast(arg0, arg1, arg2, arg3, arg4, arg5);
        var details;
        if (arg0 != null) {
            var cat = [];
            var it = arg0.getCategories()?.iterator();
            while(it != null && it.hasNext()) {
                cat.push(it.next());
            }
            details = {extras: arg0.getExtras()?.toString(), flags: arg0.getFlags(), type: arg0.getType(), categories: JSON.stringify(cat), action: arg0.getAction()};
        }

        var inPackageName = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()).includes('at ' + packageName + '.');
        var sendObj = {type: "filesystem", function: "android.content.ContextWrapper.sendStickyOrderedBroadcast", thisObjPre: thisObjPreExec, thisObjPost: classToHash(this), argTypes: ["android.content.Intent", "android.content.BroadcastReceiver", "android.os.Handler", "int", "java.lang.String", "android.os.Bundle"], args:[classToString(arg0), classToString(arg1), classToString(arg2), arg3, arg4 ? arg4.slice(0, 300) : arg4, classToString(arg5)], isInTargetPackage: inPackageName, details: details};
        send(JSON.stringify(sendObj));
        return ret;
    }

    Java.use("android.content.ContextWrapper").sendStickyOrderedBroadcastAsUser.overload("android.content.Intent", "android.os.UserHandle", "android.content.BroadcastReceiver", "android.os.Handler", "int", "java.lang.String", "android.os.Bundle").implementation = function (arg0, arg1, arg2, arg3, arg4, arg5, arg6) {
        var thisObjPreExec = classToHash(this);
        var ret = this.sendStickyOrderedBroadcastAsUser(arg0, arg1, arg2, arg3, arg4, arg5, arg6);
        var details;
        if (arg0 != null) {
            var cat = [];
            var it = arg0.getCategories()?.iterator();
            while(it != null && it.hasNext()) {
                cat.push(it.next());
            }
            details = {extras: arg0.getExtras()?.toString(), flags: arg0.getFlags(), type: arg0.getType(), categories: JSON.stringify(cat), action: arg0.getAction()};
        }

        var inPackageName = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()).includes('at ' + packageName + '.');
        var sendObj = {type: "filesystem", function: "android.content.ContextWrapper.sendStickyOrderedBroadcastAsUser", thisObjPre: thisObjPreExec, thisObjPost: classToHash(this), argTypes: ["android.content.Intent", "android.os.UserHandle", "android.content.BroadcastReceiver", "android.os.Handler", "int", "java.lang.String", "android.os.Bundle"], args:[classToString(arg0), classToString(arg1), classToString(arg2), classToString(arg3), arg4, arg5 ? arg5.slice(0, 300) : arg5, classToString(arg6)], isInTargetPackage: inPackageName, details: details};
        send(JSON.stringify(sendObj));
        return ret;
    }

    Java.use("android.content.ContextWrapper").startActivities.overload("[Landroid.content.Intent;", "android.os.Bundle").implementation = function (arg0, arg1) {
        var thisObjPreExec = classToHash(this);
        var ret = this.startActivities(arg0, arg1);
        var inPackageName = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()).includes('at ' + packageName + '.');
        var sendObj = {type: "filesystem", function: "android.content.ContextWrapper.startActivities", thisObjPre: thisObjPreExec, thisObjPost: classToHash(this), argTypes: ["android.content.Intent[]", "android.os.Bundle"], args:[classToString(arg0), classToString(arg1)], isInTargetPackage: inPackageName};
        send(JSON.stringify(sendObj));
        return ret;
    }

    Java.use("android.content.ContextWrapper").startActivities.overload("[Landroid.content.Intent;").implementation = function (arg0) {
        var thisObjPreExec = classToHash(this);
        var ret = this.startActivities(arg0);
        var inPackageName = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()).includes('at ' + packageName + '.');
        var sendObj = {type: "filesystem", function: "android.content.ContextWrapper.startActivities", thisObjPre: thisObjPreExec, thisObjPost: classToHash(this), argTypes: ["android.content.Intent[]"], args:[classToString(arg0)], isInTargetPackage: inPackageName};
        send(JSON.stringify(sendObj));
        return ret;
    }

    Java.use("android.content.ContextWrapper").startActivity.overload("android.content.Intent").implementation = function (arg0) {
        var thisObjPreExec = classToHash(this);
        var ret = this.startActivity(arg0);
        var details;
        if (arg0 != null) {
            var cat = [];
            var it = arg0.getCategories()?.iterator();
            while(it != null && it.hasNext()) {
                cat.push(it.next());
            }
            details = {extras: arg0.getExtras()?.toString(), flags: arg0.getFlags(), type: arg0.getType(), categories: JSON.stringify(cat), action: arg0.getAction()};
        }

        var inPackageName = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()).includes('at ' + packageName + '.');
        var sendObj = {type: "filesystem", function: "android.content.ContextWrapper.startActivity", thisObjPre: thisObjPreExec, thisObjPost: classToHash(this), argTypes: ["android.content.Intent"], args:[classToString(arg0)], isInTargetPackage: inPackageName, details: details};
        send(JSON.stringify(sendObj));
        return ret;
    }

    Java.use("android.content.ContextWrapper").startActivity.overload("android.content.Intent", "android.os.Bundle").implementation = function (arg0, arg1) {
        var thisObjPreExec = classToHash(this);
        var ret = this.startActivity(arg0, arg1);
        var details;
        if (arg0 != null) {
            var cat = [];
            var it = arg0.getCategories()?.iterator();
            while(it != null && it.hasNext()) {
                cat.push(it.next());
            }
            details = {extras: arg0.getExtras()?.toString(), flags: arg0.getFlags(), type: arg0.getType(), categories: JSON.stringify(cat), action: arg0.getAction()};
        }

        var inPackageName = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()).includes('at ' + packageName + '.');
        var sendObj = {type: "filesystem", function: "android.content.ContextWrapper.startActivity", thisObjPre: thisObjPreExec, thisObjPost: classToHash(this), argTypes: ["android.content.Intent", "android.os.Bundle"], args:[classToString(arg0), classToString(arg1)], isInTargetPackage: inPackageName, details: details};
        send(JSON.stringify(sendObj));
        return ret;
    }

    Java.use("android.content.ContextWrapper").startForegroundService.overload("android.content.Intent").implementation = function (arg0) {
        var thisObjPreExec = classToHash(this);
        var ret = this.startForegroundService(arg0);
        var details;
        if (arg0 != null) {
            var cat = [];
            var it = arg0.getCategories()?.iterator();
            while(it != null && it.hasNext()) {
                cat.push(it.next());
            }
            details = {extras: arg0.getExtras()?.toString(), flags: arg0.getFlags(), type: arg0.getType(), categories: JSON.stringify(cat), action: arg0.getAction()};
        }

        var inPackageName = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()).includes('at ' + packageName + '.');
        var sendObj = {type: "filesystem", function: "android.content.ContextWrapper.startForegroundService", thisObjPre: thisObjPreExec, thisObjPost: classToHash(this), argTypes: ["android.content.Intent"], args:[classToString(arg0)], returnType: "android.content.ComponentName", returnedObj: classToString(ret), isInTargetPackage: inPackageName, details: details};
        send(JSON.stringify(sendObj));
        return ret;
    }

    Java.use("android.content.ContextWrapper").startService.overload("android.content.Intent").implementation = function (arg0) {
        var thisObjPreExec = classToHash(this);
        var ret = this.startService(arg0);
        var details;
        if (arg0 != null) {
            var cat = [];
            var it = arg0.getCategories()?.iterator();
            while(it != null && it.hasNext()) {
                cat.push(it.next());
            }
            details = {extras: arg0.getExtras()?.toString(), flags: arg0.getFlags(), type: arg0.getType(), categories: JSON.stringify(cat), action: arg0.getAction()};
        }

        var inPackageName = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()).includes('at ' + packageName + '.');
        var sendObj = {type: "filesystem", function: "android.content.ContextWrapper.startService", thisObjPre: thisObjPreExec, thisObjPost: classToHash(this), argTypes: ["android.content.Intent"], args:[classToString(arg0)], returnType: "android.content.ComponentName", returnedObj: classToString(ret), isInTargetPackage: inPackageName, details: details};
        send(JSON.stringify(sendObj));
        return ret;
    }

    Java.use("android.content.ContextWrapper").stopService.overload("android.content.Intent").implementation = function (arg0) {
        var thisObjPreExec = classToHash(this);
        var ret = this.stopService(arg0);
        var details;
        if (arg0 != null) {
            var cat = [];
            var it = arg0.getCategories()?.iterator();
            while(it != null && it.hasNext()) {
                cat.push(it.next());
            }
            details = {extras: arg0.getExtras()?.toString(), flags: arg0.getFlags(), type: arg0.getType(), categories: JSON.stringify(cat), action: arg0.getAction()};
        }

        var inPackageName = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()).includes('at ' + packageName + '.');
        var sendObj = {type: "filesystem", function: "android.content.ContextWrapper.stopService", thisObjPre: thisObjPreExec, thisObjPost: classToHash(this), argTypes: ["android.content.Intent"], args:[classToString(arg0)], returnType: "boolean", returnedObj: ret, isInTargetPackage: inPackageName, details: details};
        send(JSON.stringify(sendObj));
        return ret;
    }

    Java.use("android.content.ContextWrapper").unbindService.overload("android.content.ServiceConnection").implementation = function (arg0) {
        var thisObjPreExec = classToHash(this);
        var ret = this.unbindService(arg0);
        var inPackageName = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()).includes('at ' + packageName + '.');
        var sendObj = {type: "filesystem", function: "android.content.ContextWrapper.unbindService", thisObjPre: thisObjPreExec, thisObjPost: classToHash(this), argTypes: ["android.content.ServiceConnection"], args:[classToString(arg0)], isInTargetPackage: inPackageName};
        send(JSON.stringify(sendObj));
        return ret;
    }

    Java.use("android.content.ContextWrapper").unregisterReceiver.overload("android.content.BroadcastReceiver").implementation = function (arg0) {
        var thisObjPreExec = classToHash(this);
        var ret = this.unregisterReceiver(arg0);
        var inPackageName = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()).includes('at ' + packageName + '.');
        var sendObj = {type: "filesystem", function: "android.content.ContextWrapper.unregisterReceiver", thisObjPre: thisObjPreExec, thisObjPost: classToHash(this), argTypes: ["android.content.BroadcastReceiver"], args:[classToString(arg0)], isInTargetPackage: inPackageName};
        send(JSON.stringify(sendObj));
        return ret;
    }

    Java.use("android.content.ContextWrapper").getSystemService.overload("java.lang.String").implementation = function (arg0) {
        var thisObjPreExec = classToHash(this);
        var ret = this.getSystemService(arg0);
        var inPackageName = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()).includes('at ' + packageName + '.');
        var sendObj = {type: "filesystem", function: "android.content.ContextWrapper.getSystemService", thisObjPre: thisObjPreExec, thisObjPost: classToHash(this), argTypes: ["java.lang.String"], args:[arg0 ? arg0.slice(0, 300) : arg0], returnType: "java.lang.Object", returnedObj: classToString(ret), isInTargetPackage: inPackageName};
        send(JSON.stringify(sendObj));
        return ret;
    }

    Java.use("android.app.ContextImpl").registerReceiver.overload("android.content.BroadcastReceiver", "android.content.IntentFilter").implementation = function (arg0, arg1) {
        var thisObjPreExec = classToHash(this);
        var ret = this.registerReceiver(arg0, arg1);
        var inPackageName = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()).includes('at ' + packageName + '.');
        var sendObj = {type: "filesystem", function: "android.app.ContextImpl.registerReceiver", thisObjPre: thisObjPreExec, thisObjPost: classToHash(this), argTypes: ["android.content.BroadcastReceiver", "android.content.IntentFilter"], args:[classToString(arg0), classToString(arg1)], returnType: "android.content.Intent", returnedObj: classToString(ret), isInTargetPackage: inPackageName};
        send(JSON.stringify(sendObj));
        return ret;
    }

    Java.use("android.app.ContextImpl").registerReceiver.overload("android.content.BroadcastReceiver", "android.content.IntentFilter", "java.lang.String", "android.os.Handler").implementation = function (arg0, arg1, arg2, arg3) {
        var thisObjPreExec = classToHash(this);
        var ret = this.registerReceiver(arg0, arg1, arg2, arg3);
        var inPackageName = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()).includes('at ' + packageName + '.');
        var sendObj = {type: "filesystem", function: "android.app.ContextImpl.registerReceiver", thisObjPre: thisObjPreExec, thisObjPost: classToHash(this), argTypes: ["android.content.BroadcastReceiver", "android.content.IntentFilter", "java.lang.String", "android.os.Handler"], args:[classToString(arg0), classToString(arg1), arg2 ? arg2.slice(0, 300) : arg2, classToString(arg3)], returnType: "android.content.Intent", returnedObj: classToString(ret), isInTargetPackage: inPackageName};
        send(JSON.stringify(sendObj));
        return ret;
    }

    Java.use("android.app.ContextImpl").registerReceiverForAllUsers.overload("android.content.BroadcastReceiver", "android.content.IntentFilter", "java.lang.String", "android.os.Handler").implementation = function (arg0, arg1, arg2, arg3) {
        var thisObjPreExec = classToHash(this);
        var ret = this.registerReceiverForAllUsers(arg0, arg1, arg2, arg3);
        var inPackageName = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()).includes('at ' + packageName + '.');
        var sendObj = {type: "filesystem", function: "android.app.ContextImpl.registerReceiverForAllUsers", thisObjPre: thisObjPreExec, thisObjPost: classToHash(this), argTypes: ["android.content.BroadcastReceiver", "android.content.IntentFilter", "java.lang.String", "android.os.Handler"], args:[classToString(arg0), classToString(arg1), arg2 ? arg2.slice(0, 300) : arg2, classToString(arg3)], returnType: "android.content.Intent", returnedObj: classToString(ret), isInTargetPackage: inPackageName};
        send(JSON.stringify(sendObj));
        return ret;
    }

    Java.use("android.app.ContextImpl").registerReceiverAsUser.overload("android.content.BroadcastReceiver", "android.os.UserHandle", "android.content.IntentFilter", "java.lang.String", "android.os.Handler").implementation = function (arg0, arg1, arg2, arg3, arg4) {
        var thisObjPreExec = classToHash(this);
        var ret = this.registerReceiverAsUser(arg0, arg1, arg2, arg3, arg4);
        var inPackageName = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()).includes('at ' + packageName + '.');
        var sendObj = {type: "filesystem", function: "android.app.ContextImpl.registerReceiverAsUser", thisObjPre: thisObjPreExec, thisObjPost: classToHash(this), argTypes: ["android.content.BroadcastReceiver", "android.os.UserHandle", "android.content.IntentFilter", "java.lang.String", "android.os.Handler"], args:[classToString(arg0), classToString(arg1), classToString(arg2), arg3 ? arg3.slice(0, 300) : arg3, classToString(arg4)], returnType: "android.content.Intent", returnedObj: classToString(ret), isInTargetPackage: inPackageName};
        send(JSON.stringify(sendObj));
        return ret;
    }

    Java.use("android.content.Context").getSystemService.overload("java.lang.Class").implementation = function (arg0) {
        var thisObjPreExec = classToHash(this);
        var ret = this.getSystemService(arg0);
        var inPackageName = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()).includes('at ' + packageName + '.');
        var sendObj = {type: "filesystem", function: "android.content.Context.getSystemService", thisObjPre: thisObjPreExec, thisObjPost: classToHash(this), argTypes: ["java.lang.Class"], args:[classToString(arg0)], returnType: "java.lang.Object", returnedObj: classToString(ret), isInTargetPackage: inPackageName};
        send(JSON.stringify(sendObj));
        return ret;
    }

    Java.use("android.app.Activity").startActivities.overload("[Landroid.content.Intent;", "android.os.Bundle").implementation = function (arg0, arg1) {
        var thisObjPreExec = classToHash(this);
        var ret = this.startActivities(arg0, arg1);
        var inPackageName = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()).includes('at ' + packageName + '.');
        var sendObj = {type: "filesystem", function: "android.app.Activity.startActivities", thisObjPre: thisObjPreExec, thisObjPost: classToHash(this), argTypes: ["android.content.Intent[]", "android.os.Bundle"], args:[classToString(arg0), classToString(arg1)], isInTargetPackage: inPackageName};
        send(JSON.stringify(sendObj));
        return ret;
    }

    Java.use("android.app.Activity").startActivities.overload("[Landroid.content.Intent;").implementation = function (arg0) {
        var thisObjPreExec = classToHash(this);
        var ret = this.startActivities(arg0);
        var inPackageName = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()).includes('at ' + packageName + '.');
        var sendObj = {type: "filesystem", function: "android.app.Activity.startActivities", thisObjPre: thisObjPreExec, thisObjPost: classToHash(this), argTypes: ["android.content.Intent[]"], args:[classToString(arg0)], isInTargetPackage: inPackageName};
        send(JSON.stringify(sendObj));
        return ret;
    }

    Java.use("android.app.Activity").startActivity.overload("android.content.Intent").implementation = function (arg0) {
        var thisObjPreExec = classToHash(this);
        var ret = this.startActivity(arg0);
        var details;
        if (arg0 != null) {
            var cat = [];
            var it = arg0.getCategories()?.iterator();
            while(it != null && it.hasNext()) {
                cat.push(it.next());
            }
            details = {extras: arg0.getExtras()?.toString(), flags: arg0.getFlags(), type: arg0.getType(), categories: JSON.stringify(cat), action: arg0.getAction()};
        }

        var inPackageName = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()).includes('at ' + packageName + '.');
        var sendObj = {type: "filesystem", function: "android.app.Activity.startActivity", thisObjPre: thisObjPreExec, thisObjPost: classToHash(this), argTypes: ["android.content.Intent"], args:[classToString(arg0)], isInTargetPackage: inPackageName, details: details};
        send(JSON.stringify(sendObj));
        return ret;
    }

    Java.use("android.app.Activity").startActivity.overload("android.content.Intent", "android.os.Bundle").implementation = function (arg0, arg1) {
        var thisObjPreExec = classToHash(this);
        var ret = this.startActivity(arg0, arg1);
        var details;
        if (arg0 != null) {
            var cat = [];
            var it = arg0.getCategories()?.iterator();
            while(it != null && it.hasNext()) {
                cat.push(it.next());
            }
            details = {extras: arg0.getExtras()?.toString(), flags: arg0.getFlags(), type: arg0.getType(), categories: JSON.stringify(cat), action: arg0.getAction()};
        }

        var inPackageName = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()).includes('at ' + packageName + '.');
        var sendObj = {type: "filesystem", function: "android.app.Activity.startActivity", thisObjPre: thisObjPreExec, thisObjPost: classToHash(this), argTypes: ["android.content.Intent", "android.os.Bundle"], args:[classToString(arg0), classToString(arg1)], isInTargetPackage: inPackageName, details: details};
        send(JSON.stringify(sendObj));
        return ret;
    }

    Java.use("android.app.Activity").startActivityForResult.overload("android.content.Intent", "int").implementation = function (arg0, arg1) {
        var thisObjPreExec = classToHash(this);
        var ret = this.startActivityForResult(arg0, arg1);
        var details;
        if (arg0 != null) {
            var cat = [];
            var it = arg0.getCategories()?.iterator();
            while(it != null && it.hasNext()) {
                cat.push(it.next());
            }
            details = {extras: arg0.getExtras()?.toString(), flags: arg0.getFlags(), type: arg0.getType(), categories: JSON.stringify(cat), action: arg0.getAction()};
        }

        var inPackageName = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()).includes('at ' + packageName + '.');
        var sendObj = {type: "filesystem", function: "android.app.Activity.startActivityForResult", thisObjPre: thisObjPreExec, thisObjPost: classToHash(this), argTypes: ["android.content.Intent", "int"], args:[classToString(arg0), arg1], isInTargetPackage: inPackageName, details: details};
        send(JSON.stringify(sendObj));
        return ret;
    }

    Java.use("android.app.Activity").startActivityForResult.overload("android.content.Intent", "int", "android.os.Bundle").implementation = function (arg0, arg1, arg2) {
        var thisObjPreExec = classToHash(this);
        var ret = this.startActivityForResult(arg0, arg1, arg2);
        var details;
        if (arg0 != null) {
            var cat = [];
            var it = arg0.getCategories()?.iterator();
            while(it != null && it.hasNext()) {
                cat.push(it.next());
            }
            details = {extras: arg0.getExtras()?.toString(), flags: arg0.getFlags(), type: arg0.getType(), categories: JSON.stringify(cat), action: arg0.getAction()};
        }

        var inPackageName = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()).includes('at ' + packageName + '.');
        var sendObj = {type: "filesystem", function: "android.app.Activity.startActivityForResult", thisObjPre: thisObjPreExec, thisObjPost: classToHash(this), argTypes: ["android.content.Intent", "int", "android.os.Bundle"], args:[classToString(arg0), arg1, classToString(arg2)], isInTargetPackage: inPackageName, details: details};
        send(JSON.stringify(sendObj));
        return ret;
    }

    Java.use("android.app.Activity").startActivityFromChild.overload("android.app.Activity", "android.content.Intent", "int").implementation = function (arg0, arg1, arg2) {
        var thisObjPreExec = classToHash(this);
        var ret = this.startActivityFromChild(arg0, arg1, arg2);
        var details;
        if (arg1 != null) {
            var cat = [];
            var it = arg0.getCategories()?.iterator();
            while(it != null && it.hasNext()) {
                cat.push(it.next());
            }
            details = {extras: arg1.getExtras()?.toString(), flags: arg1.getFlags(), type: arg1.getType(), categories: JSON.stringify(cat), action: arg1.getAction()};
        }

        var inPackageName = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()).includes('at ' + packageName + '.');
        var sendObj = {type: "filesystem", function: "android.app.Activity.startActivityFromChild", thisObjPre: thisObjPreExec, thisObjPost: classToHash(this), argTypes: ["android.app.Activity", "android.content.Intent", "int"], args:[classToString(arg0), classToString(arg1), arg2], isInTargetPackage: inPackageName, details: details};
        send(JSON.stringify(sendObj));
        return ret;
    }

    Java.use("android.app.Activity").startActivityFromChild.overload("android.app.Activity", "android.content.Intent", "int", "android.os.Bundle").implementation = function (arg0, arg1, arg2, arg3) {
        var thisObjPreExec = classToHash(this);
        var ret = this.startActivityFromChild(arg0, arg1, arg2, arg3);
        var details;
        if (arg1 != null) {
            var cat = [];
            var it = arg0.getCategories()?.iterator();
            while(it != null && it.hasNext()) {
                cat.push(it.next());
            }
            details = {extras: arg1.getExtras()?.toString(), flags: arg1.getFlags(), type: arg1.getType(), categories: JSON.stringify(cat), action: arg1.getAction()};
        }

        var inPackageName = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()).includes('at ' + packageName + '.');
        var sendObj = {type: "filesystem", function: "android.app.Activity.startActivityFromChild", thisObjPre: thisObjPreExec, thisObjPost: classToHash(this), argTypes: ["android.app.Activity", "android.content.Intent", "int", "android.os.Bundle"], args:[classToString(arg0), classToString(arg1), arg2, classToString(arg3)], isInTargetPackage: inPackageName, details: details};
        send(JSON.stringify(sendObj));
        return ret;
    }

    Java.use("android.app.Activity").startActivityFromFragment.overload("android.app.Fragment", "android.content.Intent", "int", "android.os.Bundle").implementation = function (arg0, arg1, arg2, arg3) {
        var thisObjPreExec = classToHash(this);
        var ret = this.startActivityFromFragment(arg0, arg1, arg2, arg3);
        var details;
        if (arg1 != null) {
            var cat = [];
            var it = arg0.getCategories()?.iterator();
            while(it != null && it.hasNext()) {
                cat.push(it.next());
            }
            details = {extras: arg1.getExtras()?.toString(), flags: arg1.getFlags(), type: arg1.getType(), categories: JSON.stringify(cat), action: arg1.getAction()};
        }

        var inPackageName = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()).includes('at ' + packageName + '.');
        var sendObj = {type: "filesystem", function: "android.app.Activity.startActivityFromFragment", thisObjPre: thisObjPreExec, thisObjPost: classToHash(this), argTypes: ["android.app.Fragment", "android.content.Intent", "int", "android.os.Bundle"], args:[classToString(arg0), classToString(arg1), arg2, classToString(arg3)], isInTargetPackage: inPackageName, details: details};
        send(JSON.stringify(sendObj));
        return ret;
    }

    Java.use("android.app.Activity").startActivityFromFragment.overload("android.app.Fragment", "android.content.Intent", "int").implementation = function (arg0, arg1, arg2) {
        var thisObjPreExec = classToHash(this);
        var ret = this.startActivityFromFragment(arg0, arg1, arg2);
        var details;
        if (arg1 != null) {
            var cat = [];
            var it = arg0.getCategories()?.iterator();
            while(it != null && it.hasNext()) {
                cat.push(it.next());
            }
            details = {extras: arg1.getExtras()?.toString(), flags: arg1.getFlags(), type: arg1.getType(), categories: JSON.stringify(cat), action: arg1.getAction()};
        }

        var inPackageName = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()).includes('at ' + packageName + '.');
        var sendObj = {type: "filesystem", function: "android.app.Activity.startActivityFromFragment", thisObjPre: thisObjPreExec, thisObjPost: classToHash(this), argTypes: ["android.app.Fragment", "android.content.Intent", "int"], args:[classToString(arg0), classToString(arg1), arg2], isInTargetPackage: inPackageName, details: details};
        send(JSON.stringify(sendObj));
        return ret;
    }

    Java.use("android.app.Activity").startActivityIfNeeded.overload("android.content.Intent", "int", "android.os.Bundle").implementation = function (arg0, arg1, arg2) {
        var thisObjPreExec = classToHash(this);
        var ret = this.startActivityIfNeeded(arg0, arg1, arg2);
        var details;
        if (arg0 != null) {
            var cat = [];
            var it = arg0.getCategories()?.iterator();
            while(it != null && it.hasNext()) {
                cat.push(it.next());
            }
            details = {extras: arg0.getExtras()?.toString(), flags: arg0.getFlags(), type: arg0.getType(), categories: JSON.stringify(cat), action: arg0.getAction()};
        }

        var inPackageName = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()).includes('at ' + packageName + '.');
        var sendObj = {type: "filesystem", function: "android.app.Activity.startActivityIfNeeded", thisObjPre: thisObjPreExec, thisObjPost: classToHash(this), argTypes: ["android.content.Intent", "int", "android.os.Bundle"], args:[classToString(arg0), arg1, classToString(arg2)], returnType: "boolean", returnedObj: ret, isInTargetPackage: inPackageName, details: details};
        send(JSON.stringify(sendObj));
        return ret;
    }

    Java.use("android.app.Activity").startActivityIfNeeded.overload("android.content.Intent", "int").implementation = function (arg0, arg1) {
        var thisObjPreExec = classToHash(this);
        var ret = this.startActivityIfNeeded(arg0, arg1);
        var details;
        if (arg0 != null) {
            var cat = [];
            var it = arg0.getCategories()?.iterator();
            while(it != null && it.hasNext()) {
                cat.push(it.next());
            }
            details = {extras: arg0.getExtras()?.toString(), flags: arg0.getFlags(), type: arg0.getType(), categories: JSON.stringify(cat), action: arg0.getAction()};
        }

        var inPackageName = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()).includes('at ' + packageName + '.');
        var sendObj = {type: "filesystem", function: "android.app.Activity.startActivityIfNeeded", thisObjPre: thisObjPreExec, thisObjPost: classToHash(this), argTypes: ["android.content.Intent", "int"], args:[classToString(arg0), arg1], returnType: "boolean", returnedObj: ret, isInTargetPackage: inPackageName, details: details};
        send(JSON.stringify(sendObj));
        return ret;
    }

    Java.use("android.app.AlarmManager").set.overload("int", "long", "android.app.PendingIntent").implementation = function (arg0, arg1, arg2) {
        var thisObjPreExec = classToHash(this);
        var ret = this.set(arg0, arg1, arg2);
        var inPackageName = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()).includes('at ' + packageName + '.');
        var sendObj = {type: "filesystem", function: "android.app.AlarmManager.set", thisObjPre: thisObjPreExec, thisObjPost: classToHash(this), argTypes: ["int", "long", "android.app.PendingIntent"], args:[arg0, arg1, classToString(arg2)], isInTargetPackage: inPackageName};
        send(JSON.stringify(sendObj));
        return ret;
    }

    Java.use("android.app.AlarmManager").set.overload("int", "long", "java.lang.String", "android.app.AlarmManager$OnAlarmListener", "android.os.Handler").implementation = function (arg0, arg1, arg2, arg3, arg4) {
        var thisObjPreExec = classToHash(this);
        var ret = this.set(arg0, arg1, arg2, arg3, arg4);
        var inPackageName = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()).includes('at ' + packageName + '.');
        var sendObj = {type: "filesystem", function: "android.app.AlarmManager.set", thisObjPre: thisObjPreExec, thisObjPost: classToHash(this), argTypes: ["int", "long", "java.lang.String", "android.app.AlarmManager$OnAlarmListener", "android.os.Handler"], args:[arg0, arg1, arg2 ? arg2.slice(0, 300) : arg2, classToString(arg3), classToString(arg4)], isInTargetPackage: inPackageName};
        send(JSON.stringify(sendObj));
        return ret;
    }

    Java.use("android.app.AlarmManager").setAndAllowWhileIdle.overload("int", "long", "android.app.PendingIntent").implementation = function (arg0, arg1, arg2) {
        var thisObjPreExec = classToHash(this);
        var ret = this.setAndAllowWhileIdle(arg0, arg1, arg2);
        var inPackageName = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()).includes('at ' + packageName + '.');
        var sendObj = {type: "filesystem", function: "android.app.AlarmManager.setAndAllowWhileIdle", thisObjPre: thisObjPreExec, thisObjPost: classToHash(this), argTypes: ["int", "long", "android.app.PendingIntent"], args:[arg0, arg1, classToString(arg2)], isInTargetPackage: inPackageName};
        send(JSON.stringify(sendObj));
        return ret;
    }

    Java.use("android.app.AlarmManager").setExact.overload("int", "long", "android.app.PendingIntent").implementation = function (arg0, arg1, arg2) {
        var thisObjPreExec = classToHash(this);
        var ret = this.setExact(arg0, arg1, arg2);
        var inPackageName = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()).includes('at ' + packageName + '.');
        var sendObj = {type: "filesystem", function: "android.app.AlarmManager.setExact", thisObjPre: thisObjPreExec, thisObjPost: classToHash(this), argTypes: ["int", "long", "android.app.PendingIntent"], args:[arg0, arg1, classToString(arg2)], isInTargetPackage: inPackageName};
        send(JSON.stringify(sendObj));
        return ret;
    }

    Java.use("android.app.AlarmManager").setExact.overload("int", "long", "java.lang.String", "android.app.AlarmManager$OnAlarmListener", "android.os.Handler").implementation = function (arg0, arg1, arg2, arg3, arg4) {
        var thisObjPreExec = classToHash(this);
        var ret = this.setExact(arg0, arg1, arg2, arg3, arg4);
        var inPackageName = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()).includes('at ' + packageName + '.');
        var sendObj = {type: "filesystem", function: "android.app.AlarmManager.setExact", thisObjPre: thisObjPreExec, thisObjPost: classToHash(this), argTypes: ["int", "long", "java.lang.String", "android.app.AlarmManager$OnAlarmListener", "android.os.Handler"], args:[arg0, arg1, arg2 ? arg2.slice(0, 300) : arg2, classToString(arg3), classToString(arg4)], isInTargetPackage: inPackageName};
        send(JSON.stringify(sendObj));
        return ret;
    }

    Java.use("android.app.AlarmManager").setExactAndAllowWhileIdle.overload("int", "long", "android.app.PendingIntent").implementation = function (arg0, arg1, arg2) {
        var thisObjPreExec = classToHash(this);
        var ret = this.setExactAndAllowWhileIdle(arg0, arg1, arg2);
        var inPackageName = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()).includes('at ' + packageName + '.');
        var sendObj = {type: "filesystem", function: "android.app.AlarmManager.setExactAndAllowWhileIdle", thisObjPre: thisObjPreExec, thisObjPost: classToHash(this), argTypes: ["int", "long", "android.app.PendingIntent"], args:[arg0, arg1, classToString(arg2)], isInTargetPackage: inPackageName};
        send(JSON.stringify(sendObj));
        return ret;
    }

    Java.use("android.app.AlarmManager").setInexactRepeating.overload("int", "long", "long", "android.app.PendingIntent").implementation = function (arg0, arg1, arg2, arg3) {
        var thisObjPreExec = classToHash(this);
        var ret = this.setInexactRepeating(arg0, arg1, arg2, arg3);
        var inPackageName = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()).includes('at ' + packageName + '.');
        var sendObj = {type: "filesystem", function: "android.app.AlarmManager.setInexactRepeating", thisObjPre: thisObjPreExec, thisObjPost: classToHash(this), argTypes: ["int", "long", "long", "android.app.PendingIntent"], args:[arg0, arg1, arg2, classToString(arg3)], isInTargetPackage: inPackageName};
        send(JSON.stringify(sendObj));
        return ret;
    }

    Java.use("android.app.AlarmManager").setRepeating.overload("int", "long", "long", "android.app.PendingIntent").implementation = function (arg0, arg1, arg2, arg3) {
        var thisObjPreExec = classToHash(this);
        var ret = this.setRepeating(arg0, arg1, arg2, arg3);
        var inPackageName = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()).includes('at ' + packageName + '.');
        var sendObj = {type: "filesystem", function: "android.app.AlarmManager.setRepeating", thisObjPre: thisObjPreExec, thisObjPost: classToHash(this), argTypes: ["int", "long", "long", "android.app.PendingIntent"], args:[arg0, arg1, arg2, classToString(arg3)], isInTargetPackage: inPackageName};
        send(JSON.stringify(sendObj));
        return ret;
    }

    Java.use("android.app.AlarmManager").setWindow.overload("int", "long", "long", "android.app.PendingIntent").implementation = function (arg0, arg1, arg2, arg3) {
        var thisObjPreExec = classToHash(this);
        var ret = this.setWindow(arg0, arg1, arg2, arg3);
        var inPackageName = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()).includes('at ' + packageName + '.');
        var sendObj = {type: "filesystem", function: "android.app.AlarmManager.setWindow", thisObjPre: thisObjPreExec, thisObjPost: classToHash(this), argTypes: ["int", "long", "long", "android.app.PendingIntent"], args:[arg0, arg1, arg2, classToString(arg3)], isInTargetPackage: inPackageName};
        send(JSON.stringify(sendObj));
        return ret;
    }

    Java.use("android.app.AlarmManager").setWindow.overload("int", "long", "long", "java.lang.String", "android.app.AlarmManager$OnAlarmListener", "android.os.Handler").implementation = function (arg0, arg1, arg2, arg3, arg4, arg5) {
        var thisObjPreExec = classToHash(this);
        var ret = this.setWindow(arg0, arg1, arg2, arg3, arg4, arg5);
        var inPackageName = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()).includes('at ' + packageName + '.');
        var sendObj = {type: "filesystem", function: "android.app.AlarmManager.setWindow", thisObjPre: thisObjPreExec, thisObjPost: classToHash(this), argTypes: ["int", "long", "long", "java.lang.String", "android.app.AlarmManager$OnAlarmListener", "android.os.Handler"], args:[arg0, arg1, arg2, arg3 ? arg3.slice(0, 300) : arg3, classToString(arg4), classToString(arg5)], isInTargetPackage: inPackageName};
        send(JSON.stringify(sendObj));
        return ret;
    }

    Java.use("android.view.View").setFilterTouchesWhenObscured.overload("boolean").implementation = function (arg0) {
        var thisObjPreExec = classToHash(this);
        var ret = this.setFilterTouchesWhenObscured(arg0);
        var inPackageName = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()).includes('at ' + packageName + '.');
        var sendObj = {type: "filesystem", function: "android.view.View.setFilterTouchesWhenObscured", thisObjPre: thisObjPreExec, thisObjPost: classToHash(this), argTypes: ["boolean"], args:[arg0], isInTargetPackage: inPackageName};
        send(JSON.stringify(sendObj));
        return ret;
    }


});
