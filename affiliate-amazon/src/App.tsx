import { Admin, Resource } from "react-admin";
import { Layout } from "./Layout";
import { dataProvider } from "./dataProvider";
import { ProductList } from "./productList";
import { authProvider } from "./authProvider";
import { ProductEdit } from "./edit";

export const App = () => (
  <Admin
    layout={Layout}
    dataProvider={dataProvider}
    authProvider={authProvider}
  >
    <Resource name="products" list={ProductList} edit={ProductEdit} />
  </Admin>
)