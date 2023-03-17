import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
  Button,
  Alert,
} from "react-native";
import { Text, Left, Right, ListItem, Thumbnail, Body } from "native-base";
import { connect } from "react-redux";
import * as actions from "../../../Redux/Actions/cartActions";

import Toast from "react-native-toast-message";
import axios from "axios";
import baseURL from "../../../assets/common/baseUrl";
import EasyButton from "../../../Shared/StyledComponents/EasyButton";

var { width, height } = Dimensions.get("window");
import {
  CardForm,
  StripeProvider,
  confirmPayment,
} from "@stripe/stripe-react-native";

const Confirm = (props) => {
  const finalOrder = props.route.params;
  const selected = finalOrder?.selected;

  // Add this
  const [productUpdate, setProductUpdate] = useState();
  useEffect(() => {
    if (finalOrder) {
      getProducts(finalOrder);
    }
    return () => {
      setProductUpdate();
    };
  }, [props]);

  // Add this
  const getProducts = (x) => {
    const order = x.order.order;
    var products = [];
    if (order) {
      order.orderItems.forEach((cart) => {
        axios
          .get(`${baseURL}products/${cart.product}`)
          .then((data) => {
            products.push(data.data);
            setProductUpdate(products);
          })
          .catch((e) => {
            console.log(e);
          });
      });
    }
  };

  const confirmOrder = () => {
    const order = finalOrder.order.order;
    axios
      .post(`${baseURL}orders`, order)
      .then((res) => {
        if (res.status == 200 || res.status == 201) {
          Toast.show({
            topOffset: 60,
            type: "success",
            text1: "Order Completed",
            text2: "",
          });
          setTimeout(() => {
            props.clearCart();
            props.navigation.navigate("Cart");
          }, 500);
        }
      })
      .catch((error) => {
        Toast.show({
          topOffset: 60,
          type: "error",
          text1: "Something went wrong",
          text2: "Please try again",
        });
      });
  };

  //stripe
  const showMessags = () => {
    Toast.show({
      topOffset: 60,
      type: "success",
      text1: "Payment success",
      text2: "",
    });
    setTimeout(() => {}, 10000);
  };

  const fetchPaymentClientSecret = async () => {
    const response = await axios.post(`${baseURL}orders`, {});
    const { clientSecret } = await response.json();
    return clientSecret;
  };

  const buy = async () => {
    const clientSecret = "await fetchPaymentClientSecret()";
    const { error, paymentIntent } = await confirmPayment(clientSecret, {
      paymentMethodType: "Card",
    });

    if (error) {
      showMessags();
      confirmOrder();
    } else if (paymentIntent) {
      showMessags();
      confirmOrder();
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>Confirm Order</Text>
        {props.route.params ? (
          <View style={{ borderWidth: 1, borderColor: "orange" }}>
            <Text style={styles.title}>Shipping to:</Text>
            <View style={{ padding: 8 }}>
              <Text>Address: {finalOrder.order.order.shippingAddress1}</Text>
              <Text>Address2: {finalOrder.order.order.shippingAddress2}</Text>
              <Text>City: {finalOrder.order.order.city}</Text>
              <Text>Zip Code: {finalOrder.order.order.zip}</Text>
              <Text>Country: {finalOrder.order.order.country}</Text>
            </View>
            <Text style={styles.title}>Items:</Text>
            {/* CHANGE THIS */}
            {productUpdate && (
              <>
                {productUpdate.map((x) => {
                  return (
                    <ListItem style={styles.listItem} key={x.name} avatar>
                      <Left>
                        <Thumbnail source={{ uri: x.image }} />
                      </Left>
                      <Body style={styles.body}>
                        <Left>
                          <Text>{x.name}</Text>
                        </Left>
                        <Right>
                          <Text>$ {x.price}</Text>
                        </Right>
                      </Body>
                    </ListItem>
                  );
                })}
              </>
            )}
          </View>
        ) : null}
        {selected != 2 ? (
          <View style={{ alignItems: "center", margin: 20 }}>
            <EasyButton large third onPress={confirmOrder}>
              <Text style={{ color: "white" }}>Place order</Text>
            </EasyButton>
          </View>
        ) : (
          <StripeProvider publishableKey="pk_test_51L27CLL5vXq2N6I1XbXkLZB3FrpEmOowufJ0NAgsWIEYRmQ6aWC5D6t4lIZNaZmg4MPXS2Y2LLIQzDVNOmGXul1t00v3uZt4RU">
            <CardForm
              style={{
                width: "90%",
                height: 200,
                marginVertical: 30,
              }}
            />
            <View style={{ alignItems: "center", margin: 20 }}>
              <EasyButton large third onPress={buy}>
                <Text style={{ color: "white" }}>Place order</Text>
              </EasyButton>
            </View>
          </StripeProvider>
        )}
      </View>
    </ScrollView>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    clearCart: () => dispatch(actions.clearCart()),
  };
};

const styles = StyleSheet.create({
  container: {
    height: height,
    padding: 8,
    alignContent: "center",
    backgroundColor: "white",
  },
  titleContainer: {
    justifyContent: "center",
    alignItems: "center",
    margin: 8,
  },
  title: {
    alignSelf: "center",
    margin: 8,
    fontSize: 16,
    fontWeight: "bold",
  },
  listItem: {
    alignItems: "center",
    backgroundColor: "white",
    justifyContent: "center",
    width: width / 1.2,
  },
  body: {
    margin: 10,
    alignItems: "center",
    flexDirection: "row",
  },
});

export default connect(null, mapDispatchToProps)(Confirm);
