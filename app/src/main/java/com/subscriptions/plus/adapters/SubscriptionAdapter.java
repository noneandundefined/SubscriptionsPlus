package com.subscriptions.plus.adapters;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.appcompat.widget.PopupMenu;
import androidx.recyclerview.widget.RecyclerView;
import com.subscriptions.plus.MainActivity;
import com.subscriptions.plus.R;
import com.subscriptions.plus.models.SubscriptionModel;
import com.subscriptions.plus.repositories.JsonSubscriptionRepository;

import java.util.List;

public class SubscriptionAdapter extends RecyclerView.Adapter<SubscriptionAdapter.ViewHolder> {
    private List<SubscriptionModel> subscriptions;
    private Context context;
    private JsonSubscriptionRepository repository;

    public SubscriptionAdapter(Context context, List<SubscriptionModel> subscriptions, JsonSubscriptionRepository repository) {
        this.context = context;
        this.subscriptions = subscriptions;
        this.repository = repository;
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.item_subscription, parent, false);
        return new ViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
        SubscriptionModel item = subscriptions.get(position);
        holder.tvName.setText(item.getName());
        holder.tvDatePrice.setText(item.getNextPaymentDate() + " • " + item.getPrice());

        holder.ivMenu.setOnClickListener(v -> {
            PopupMenu popupMenu = new PopupMenu(context, holder.ivMenu);
            popupMenu.getMenuInflater().inflate(R.menu.menu_item_options, popupMenu.getMenu());
            popupMenu.setOnMenuItemClickListener(menuItem -> {
                int id = menuItem.getItemId();
                if (id == R.id.action_edit) {
                    if (context instanceof MainActivity) {
                        ((MainActivity) context).showEditDialog(item, position);
                    }
                    return true;
                } else if (id == R.id.action_delete) {
                    if (context instanceof MainActivity) {
                        ((MainActivity) context).deleteItem(item, position);
                    }
                    return true;
                }
                return false;
            });
            popupMenu.show();
        });
    }

    @Override
    public int getItemCount() {
        return subscriptions.size();
    }

    public static class ViewHolder extends RecyclerView.ViewHolder {
        TextView tvName, tvDatePrice;
        ImageView ivMenu;

        public ViewHolder(View itemView) {
            super(itemView);
            tvName = itemView.findViewById(R.id.tvName);
            tvDatePrice = itemView.findViewById(R.id.tvDatePrice);
            ivMenu = itemView.findViewById(R.id.ivMenu);
        }
    }
}
