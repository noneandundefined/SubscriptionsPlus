package com.subscriptions.plus;

import android.app.AlarmManager;
import android.app.DatePickerDialog;
import android.app.PendingIntent;
import android.content.Intent;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;
import androidx.appcompat.app.AlertDialog;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import com.google.android.material.floatingactionbutton.FloatingActionButton;
import com.google.android.material.snackbar.Snackbar;
import androidx.appcompat.app.AppCompatActivity;
import android.view.View;
import androidx.navigation.NavController;
import androidx.navigation.Navigation;
import androidx.navigation.ui.AppBarConfiguration;
import androidx.navigation.ui.NavigationUI;
import com.subscriptions.plus.adapters.SubscriptionAdapter;
import com.subscriptions.plus.databinding.ActivityMainBinding;

import android.view.Menu;
import android.view.MenuItem;
import com.subscriptions.plus.logging.Logging;
import com.subscriptions.plus.models.SubscriptionModel;
import com.subscriptions.plus.repositories.JsonSubscriptionRepository;
import com.subscriptions.plus.utils.SubscriptionNotification;

import java.util.Calendar;
import java.util.List;

public class MainActivity extends AppCompatActivity {

    private JsonSubscriptionRepository repository;
    private SubscriptionAdapter adapter;
    private List<SubscriptionModel> subscriptions;

    private TextView subEmpty;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        Logging.init(this);

        setContentView(R.layout.activity_main);

        repository = new JsonSubscriptionRepository(this);
        subscriptions = repository.getAll();
        subEmpty = findViewById(R.id.subEmpty);

        RecyclerView recyclerView = findViewById(R.id.recyclerView);
        recyclerView.setLayoutManager(new LinearLayoutManager(this));
        adapter = new SubscriptionAdapter(this, subscriptions, repository);
        recyclerView.setAdapter(adapter);

        FloatingActionButton fab = findViewById(R.id.fab);
        fab.setOnClickListener(v -> showAddDialog());

        checkIfEmpty();

        adapter.registerAdapterDataObserver(new RecyclerView.AdapterDataObserver() {
            @Override
            public void onChanged() {
                super.onChanged();
                checkIfEmpty();
            }
        });

        Intent serviceIntent = new Intent(this, SubscriptionNotification.class);
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
            startForegroundService(serviceIntent);
        } else {
            startService(serviceIntent);
        }

        AlarmManager alarmManager = (AlarmManager) getSystemService(ALARM_SERVICE);
        Intent intent = new Intent(this, SubscriptionNotification.class);
        PendingIntent pendingIntent = PendingIntent.getService(
                this, 0, intent, PendingIntent.FLAG_IMMUTABLE
        );

        Calendar calendar = Calendar.getInstance();
        calendar.set(Calendar.HOUR_OF_DAY, 9);
        calendar.set(Calendar.MINUTE, 0);
        calendar.set(Calendar.SECOND, 0);

        alarmManager.setInexactRepeating(
                AlarmManager.RTC_WAKEUP,
                calendar.getTimeInMillis(),
                AlarmManager.INTERVAL_DAY,
                pendingIntent
        );
    }

    private void checkIfEmpty() {
        if (adapter.getItemCount() == 0) {
            subEmpty.setVisibility(View.VISIBLE);
        } else {
            subEmpty.setVisibility(View.GONE);
        }
    }

    private void showAddDialog() {
        View dialogView = LayoutInflater.from(this).inflate(R.layout.dialog_add_subscription, null);
        EditText editName = dialogView.findViewById(R.id.editName);
        EditText editPrice = dialogView.findViewById(R.id.editPrice);
        EditText editDate = dialogView.findViewById(R.id.editDate);

        editDate.setFocusable(false);
        editDate.setClickable(true);
        editDate.setOnClickListener(v -> {
            final Calendar c = Calendar.getInstance();
            int year = c.get(Calendar.YEAR);
            int month = c.get(Calendar.MONTH);
            int day = c.get(Calendar.DAY_OF_MONTH);

            DatePickerDialog datePickerDialog = new DatePickerDialog(
                    MainActivity.this,
                    (view, year1, month1, dayOfMonth) -> {
                        String selectedDate = String.format("%02d/%02d/%04d", dayOfMonth, month1 + 1, year1);
                        editDate.setText(selectedDate);
                    },
                    year, month, day
            );

            datePickerDialog.show();
        });

        new AlertDialog.Builder(this)
                .setView(dialogView)
                .setPositiveButton("Add", (dialog, which) -> {
                    String name = editName.getText().toString();
                    String priceText = editPrice.getText().toString().trim();
                    String date = editDate.getText().toString();

                    if (name.isEmpty() || priceText.isEmpty() || date.isEmpty()) {
                        Toast.makeText(this, "Not all fields are filled in", Toast.LENGTH_SHORT).show();
                        return;
                    }

                    double price;
                    try {
                        price = Double.parseDouble(priceText);
                    } catch (NumberFormatException e) {
                        Toast.makeText(this, "Enter a valid price", Toast.LENGTH_SHORT).show();
                        return;
                    }

                    SubscriptionModel subscription = new SubscriptionModel(name, price, date);
                    repository.add(subscription);
                    subscriptions.clear();
                    subscriptions.addAll(repository.getAll());
                    adapter.notifyDataSetChanged();
                })
                .setNegativeButton("Cancel", null)
                .show();
    }

    public void showEditDialog(SubscriptionModel item, int position) {
        View dialogView = LayoutInflater.from(this).inflate(R.layout.dialog_add_subscription, null);
        EditText editName = dialogView.findViewById(R.id.editName);
        EditText editPrice = dialogView.findViewById(R.id.editPrice);
        EditText editDate = dialogView.findViewById(R.id.editDate);

        // Предзаполнить данные
        editName.setText(item.getName());
        editPrice.setText(String.valueOf(item.getPrice()));
        editDate.setText(item.getNextPaymentDate());

        editDate.setFocusable(false);
        editDate.setClickable(true);
        editDate.setOnClickListener(v -> {
            Calendar c = Calendar.getInstance();
            int year = c.get(Calendar.YEAR);
            int month = c.get(Calendar.MONTH);
            int day = c.get(Calendar.DAY_OF_MONTH);

            DatePickerDialog datePickerDialog = new DatePickerDialog(
                    MainActivity.this,
                    (view, year1, month1, dayOfMonth) -> editDate.setText(String.format("%02d/%02d/%04d", dayOfMonth, month1 + 1, year1)),
                    year, month, day
            );
            datePickerDialog.show();
        });

        new AlertDialog.Builder(this)
                .setView(dialogView)
                .setPositiveButton("Save", (dialog, which) -> {
                    String name = editName.getText().toString();
                    double price = Double.parseDouble(editPrice.getText().toString());
                    String date = editDate.getText().toString();

                    // Обновляем данные в репозитории
                    SubscriptionModel newItem = new SubscriptionModel(name, price, date);
                    repository.update(item.getName(), newItem);

                    // Обновляем список
                    subscriptions.set(position, newItem);
                    adapter.notifyItemChanged(position);
                })
                .setNegativeButton("Cancel", null)
                .show();
    }

    public void deleteItem(SubscriptionModel item, int position) {
        repository.delete(item.getName());

        subscriptions.remove(position);
        adapter.notifyItemRemoved(position);

        Toast.makeText(this, item.getName() + " deleted", Toast.LENGTH_SHORT).show();
    }
}