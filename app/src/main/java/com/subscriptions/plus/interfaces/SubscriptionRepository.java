package com.subscriptions.plus.interfaces;

import com.subscriptions.plus.models.SubscriptionModel;
import java.util.List;

public interface SubscriptionRepository {
    List<SubscriptionModel> getAll();

    void add(SubscriptionModel subscription);

    void update(String name, SubscriptionModel newSubscription);

    void delete(String name);
}
