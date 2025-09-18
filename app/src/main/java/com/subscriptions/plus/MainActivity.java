package com.subscriptions.plus;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.widget.EditText;
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

import java.util.List;

public class MainActivity extends AppCompatActivity {

    private JsonSubscriptionRepository repository;
    private SubscriptionAdapter adapter;
    private List<SubscriptionModel> subscriptions;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        Logging.init(this);

        repository = new JsonSubscriptionRepository(this);
        subscriptions = repository.getAll();

        RecyclerView recyclerView = findViewById(R.id.recyclerView);
        recyclerView.setLayoutManager(new LinearLayoutManager(this));
        adapter = new SubscriptionAdapter(subscriptions);
        recyclerView.setAdapter(adapter);

        FloatingActionButton fab = findViewById(R.id.fab);
        fab.setOnClickListener(v -> showAddDialog());
    }

    private void showAddDialog() {
        View dialogView = LayoutInflater.from(this).inflate(R.layout.dialog_add_subscription, null);
        EditText editName = dialogView.findViewById(R.id.editName);
        EditText editPrice = dialogView.findViewById(R.id.editPrice);
        EditText editDate = dialogView.findViewById(R.id.editDate);

        new AlertDialog.Builder(this)
                .setView(dialogView)
                .setPositiveButton("Добавить", (dialog, which) -> {
                    String name = editName.getText().toString();
                    double price = Double.parseDouble(editPrice.getText().toString());
                    String date = editDate.getText().toString();

                    SubscriptionModel subscription = new SubscriptionModel(name, price, date);
                    repository.add(subscription);
                    subscriptions.clear();
                    subscriptions.addAll(repository.getAll());
                    adapter.notifyDataSetChanged();
                })
                .setNegativeButton("Отмена", null)
                .show();
    }
}