import { Admin, Resource } from "react-admin";
import { Layout } from "./Layout";
import { dataProvider } from "./dataProvider";
import { ProductList } from "./productList";

export const App = () => (
  <Admin layout={Layout} dataProvider={dataProvider}>
    <Resource name="products" list={ProductList} />
  </Admin>
)