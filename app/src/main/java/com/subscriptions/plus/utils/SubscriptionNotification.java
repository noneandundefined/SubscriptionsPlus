package com.subscriptions.plus.utils;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Intent;
import android.os.Build;
import android.os.IBinder;
import androidx.annotation.Nullable;
import androidx.core.app.NotificationCompat;
import com.subscriptions.plus.MainActivity;
import com.subscriptions.plus.R;
import com.subscriptions.plus.logging.Logging;
import com.subscriptions.plus.models.SubscriptionModel;
import com.subscriptions.plus.repositories.JsonSubscriptionRepository;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.List;
import java.util.Locale;

public class SubscriptionNotification extends Service {
    private static final String CHANNEL_ID = "subscription_service_channel";

    @Override
    public void onCreate() {
        super.onCreate();

        try {
            createNotificationChannel();
            startForeground(1, getForegroundNotification("Subscription Service running"));
            checkSubscriptions();
        } catch (Exception ex) {
            ex.printStackTrace();
        }
    }

    private void createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(
                    CHANNEL_ID,
                    "Subscription Notifications",
                    NotificationManager.IMPORTANCE_LOW
            );

            NotificationManager manager = getSystemService(NotificationManager.class);

            if (manager != null) manager.createNotificationChannel(channel);
        }
    }

    private NotificationCompat.Builder getNotificationBuilder(String content) {
        Intent intent = new Intent(this, MainActivity.class);
        PendingIntent pendingIntent = PendingIntent.getActivity(this, 0, intent, PendingIntent.FLAG_IMMUTABLE);

        return new NotificationCompat.Builder(this, CHANNEL_ID)
                .setContentTitle("Subscriptions")
                .setContentText(content)
                .setSmallIcon(R.mipmap.ic_launcher)
                .setContentIntent(pendingIntent)
                .setAutoCancel(true);
    }

    private android.app.Notification getForegroundNotification(String content) {
        NotificationCompat.Builder builder;

        try {
            builder = getNotificationBuilder(content);
        } catch (Exception e) {
            builder = new NotificationCompat.Builder(this, CHANNEL_ID)
                    .setContentTitle("Subscriptions")
                    .setContentText(content)
                    .setSmallIcon(R.mipmap.ic_launcher)
                    .setAutoCancel(true);
        }

        return builder.build();
    }

    private void checkSubscriptions() {
        JsonSubscriptionRepository repository = new JsonSubscriptionRepository(this);
        List<SubscriptionModel> subscriptions = repository.getAll();

        Calendar now = Calendar.getInstance();
        SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy", Locale.getDefault());

        for (SubscriptionModel s : subscriptions) {
            String dateText = s.getNextPaymentDate();
            if (dateText == null || dateText.isEmpty()) continue;

            try {
                Calendar subscriptionDate = Calendar.getInstance();
                subscriptionDate.setTime(sdf.parse(dateText));

                long diffMillis = subscriptionDate.getTimeInMillis() - now.getTimeInMillis();
                long diffDays = diffMillis / (1000 * 60 * 60 * 24);

                if (diffDays == 3) {
                    NotificationManager manager = (NotificationManager) getSystemService(NOTIFICATION_SERVICE);
                    if (manager != null) {
                        manager.notify(
                                (int) System.currentTimeMillis(),
                                getNotificationBuilder(
                                        s.getName() + " will expire in 3 days"
                                ).build()
                        );
                    }
                }

            } catch (ParseException e) {
                e.printStackTrace();
            }
        }
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        return START_STICKY;
    }

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }
}
