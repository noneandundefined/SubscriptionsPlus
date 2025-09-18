package com.subscriptions.plus.repositories;

import android.content.Context;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.subscriptions.plus.constants.Files;
import com.subscriptions.plus.interfaces.SubscriptionRepository;
import com.subscriptions.plus.logging.Logging;
import com.subscriptions.plus.models.SubscriptionModel;

import java.io.*;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class JsonSubscriptionRepository implements SubscriptionRepository {
    private static final Gson gson = new Gson();
    private List<SubscriptionModel> subscriptions;

    private final File storageFile;

    public JsonSubscriptionRepository(Context context) {
        this.storageFile = new File(context.getFilesDir(), Files.FILE_SUBSCRIPTIONS_JSON);
        this.subscriptions = load();
    }

    private List<SubscriptionModel> load() {
        if (!storageFile.exists()) {
            try {
                storageFile.createNewFile();
                try (Writer writer = new FileWriter(storageFile)) {
                    gson.toJson(new ArrayList<SubscriptionModel>(), writer);
                }
            } catch (IOException e) {
                Logging.error("Failed to create file: " + storageFile.getAbsolutePath(), e.getMessage(), e);
                return new ArrayList<>();
            }
            return new ArrayList<>();
        }

        try (Reader reader = new FileReader(storageFile)) {
            Type listType = new TypeToken<List<SubscriptionModel>>() {}.getType();
            List<SubscriptionModel> data = gson.fromJson(reader, listType);
            return (data != null) ? data : new ArrayList<>();
        } catch (IOException ex) {
            Logging.error("Failed to load " + storageFile.getAbsolutePath(), ex.getMessage(), ex);
            return new ArrayList<>();
        }
    }

    private void save() {
        try (Writer writer = new FileWriter(storageFile)) {
            gson.toJson(subscriptions, writer);
        } catch (IOException ex) {
            Logging.error(String.format("Failed save %s", storageFile.getAbsolutePath()), ex.getMessage(), ex);
        }
    }

    @Override
    public List<SubscriptionModel> getAll() {
        return new ArrayList<>(subscriptions);
    }

    @Override
    public void add(SubscriptionModel subscription) {
        subscriptions.add(subscription);
        save();
    }

    @Override
    public void update(String name, SubscriptionModel newSubscription) {
        for (int i = 0; i < subscriptions.size(); i++) {
            if (subscriptions.get(i).getName().equalsIgnoreCase(name)) {
                subscriptions.set(i, newSubscription);
                save();

                return;
            }
        }
    }

    @Override
    public void delete(String name) {
        subscriptions.removeIf(s -> s.getName().equalsIgnoreCase(name));
        save();
    }
}
