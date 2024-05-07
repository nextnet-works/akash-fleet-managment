import { Home } from "./components/Home";
// import YamlEditor from "@focus-reactive/react-yaml";

// const obj = { foo: "bar" };
// const handleChange = ({ json, text }: { json: any; text: string }) => {
//   console.log(json, text);
// };
export const App = () => {
  return (
    <div>
      <Home />
      {/* <div className="max-w-xl p-4 m-auto">
        <YamlEditor json={obj} onChange={handleChange} />
      </div> */}
    </div>
  );
};
