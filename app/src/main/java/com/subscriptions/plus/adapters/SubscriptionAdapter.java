package com.subscriptions.plus.adapters;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;
import com.subscriptions.plus.R;
import com.subscriptions.plus.models.SubscriptionModel;

import java.util.List;

public class SubscriptionAdapter extends RecyclerView.Adapter<SubscriptionAdapter.ViewHolder> {
    private List<SubscriptionModel> subscriptions;

    public SubscriptionAdapter(List<SubscriptionModel> subscriptions) {
        this.subscriptions = subscriptions;
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
        SubscriptionModel sub = subscriptions.get(position);
        holder.tvName.setText(sub.getName());
        holder.tvDatePrice.setText(sub.getNextPaymentDate() + " • " + sub.getPrice() + "₽");
    }

    @Override
    public int getItemCount() {
        return subscriptions.size();
    }

    public static class ViewHolder extends RecyclerView.ViewHolder {
        TextView tvName, tvDatePrice;

        public ViewHolder(View itemView) {
            super(itemView);
            tvName = itemView.findViewById(R.id.tvName);
            tvDatePrice = itemView.findViewById(R.id.tvDatePrice);
        }
    }
}
