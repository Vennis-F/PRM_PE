import React, { useState } from "react";
import { View, Button } from "react-native";
import {
  Container,
  Header,
  Content,
  ListItem,
  Text,
  Radio,
  Right,
  Left,
  Picker,
  Icon,
  Body,
  Title,
} from "native-base";
import EasyButton from "../../../Shared/StyledComponents/EasyButton";

const methods = [
  { name: "Cash on Delivery", value: 1 },
  { name: "Card Payment", value: 2 },
];

const paymentCards = [
  { name: "Visa", value: 1 },
  { name: "MasterCard", value: 2 },
];

const Payment = (props) => {
  const order = props.route.params;

  const [selected, setSelected] = useState();
  const [card, setCard] = useState();
  return (
    <Container>
      <Header style={{ backgroundColor: "#009e96" }}>
        <Body style={{ backgroundColor: "#009e96" }}>
          <Title>Choose your payment method</Title>
        </Body>
      </Header>
      <Content>
        {methods.map((item, index) => {
          return (
            <ListItem key={item.name} onPress={() => setSelected(item.value)}>
              <Left>
                <Text>{item.name}</Text>
              </Left>
              <Right>
                <Radio selected={selected == item.value} />
              </Right>
            </ListItem>
          );
        })}
        {selected == 2 ? (
          <Picker
            mode="dropdown"
            iosIcon={<Icon name={"arrow-down"} />}
            headerStyle={{ backgroundColor: "orange" }}
            headerBackButtonTextStyle={{ color: "#fff" }}
            headerTitleStyle={{ color: "#fff" }}
            selectedValue={card}
            onValueChange={(x) => setCard(x)}
          >
            {paymentCards.map((c, index) => {
              return <Picker.Item key={c.name} label={c.name} value={c.name} />;
            })}
          </Picker>
        ) : null}
        <View style={{ marginTop: 60, alignSelf: "center" }}>
          <EasyButton
            large
            third
            onPress={() =>
              props.navigation.navigate("Confirm", { order, selected })
            }
          >
            <Text style={{ color: "white" }}>Confirm</Text>
          </EasyButton>
        </View>
      </Content>
    </Container>
  );
};

export default Payment;
