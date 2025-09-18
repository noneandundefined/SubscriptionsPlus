package com.subscriptions.plus.logging;

import android.content.Context;
import android.util.Log;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

public class Logging {
    private static File logErrorFile;
    private static File logAppFile;

    public static void init(Context context) {
        File cacheDir = context.getCacheDir();

        String dFolder = new SimpleDateFormat("dd.MM", Locale.getDefault()).format(new Date());

        File logDir = new File(cacheDir, dFolder);
        if (!logDir.exists() && !logDir.mkdirs()) {
            Log.e("LogUtils", "Failed to create log directory: " + logDir.getAbsolutePath());
            return;
        }

        logErrorFile = new File(logDir, "error.log");
        logAppFile = new File(logDir, "app.log");

        try {
            if (!logErrorFile.exists()) logErrorFile.createNewFile();
            if (!logAppFile.exists()) logAppFile.createNewFile();
        } catch (IOException ex) {
            Log.e("LogUtils", "Failed to create log files", ex);
        }
    }

    public static void log(String tag, String msg) {
        Log.e(tag, msg);
        write(logAppFile, tag, msg);
    }

    public static void error(String tag, String msg, Throwable t) {
        Log.e(tag, msg, t);
        String errorMsg = msg + "\n" + Log.getStackTraceString(t);
        write(logErrorFile, tag, errorMsg);
    }

    private static void write(File file, String tag, String msg) {
        if (file == null) return;

        String timestamp = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss", Locale.getDefault()).format(new Date());
        String fMsg = timestamp + " [" + tag + "] " + msg + "\n";

        try (FileWriter w = new FileWriter(file, true)) {
            w.append(fMsg);
        } catch(IOException ex) {
            Log.e("LogUtils", "Failed to write log", ex);
        }
    }

}
