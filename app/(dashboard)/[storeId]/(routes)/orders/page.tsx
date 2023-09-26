import React from "react";
import { OrderClient } from "./components/client";
import prismadb from "@/lib/prismadb";
import { format } from "date-fns";
import { OrderColumn } from "./components/colums";
import { formatter } from "@/lib/utils";

const OrdersPage = async ({ params }: { params: { storeId: string } }) => {
  const orders = await prismadb.order.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formatedOrders: OrderColumn[] = orders.map((order) => {
    return {
      id: order.id,
      phone: order.phone,
      address: order.address,
      products: order.orderItems
        .map((orderItem) => orderItem.product.name)
        .join(","),
      totalPrice: formatter.format(
        order.orderItems.reduce((total, order) => {
          return total + Number(order.product.price);
        }, 0)
      ),
      isPaid: order.isPaid,
      createdAt: format(order.createdAt, "MMMM do, yyyy"),
    };
  });

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <OrderClient data={formatedOrders} />
      </div>
    </div>
  );
};

export default OrdersPage;
