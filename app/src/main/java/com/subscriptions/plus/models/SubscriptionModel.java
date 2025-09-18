package com.subscriptions.plus.models;

import com.google.gson.annotations.SerializedName;

public class SubscriptionModel {
    @SerializedName("name")
    private String name;

    @SerializedName("price")
    private double price;

    @SerializedName("next_payment_date")
    private String nextPaymentDate;

    public SubscriptionModel(String name, double price, String nextPaymentDate) {
        this.name = name;
        this.price = price;
        this.nextPaymentDate = nextPaymentDate;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public String getNextPaymentDate() {
        return nextPaymentDate;
    }

    public void setNextPaymentDate(String nextPaymentDate) {
        this.nextPaymentDate = nextPaymentDate;
    }

    @Override
    public String toString() {
        return name + " (" + price + "$, " + nextPaymentDate + ")";
    }
}
