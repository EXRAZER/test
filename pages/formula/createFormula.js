import Layout from "../../components/Layout";
import {
  Badge,
  Button,
  Dialog,
  Group,
  Input,
  MultiSelect,
  NumberInput,
  Select,
  Stepper,
  Table,
  Text,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import LoadingPage from "../../components/LoadingPage";
import { useRouter } from "next/router";

import { Chevron } from "../../components/icons"

export default function CreateFormula() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const [items, setItems] = useState([]);

  const [itemId, setItemId] = useState("");
  const [formulaName, setFormulaName] = useState("");
  const [desc, setDesc] = useState("");
  const [costFormula, setCostFormula] = useState("");

  const [dict, setDict] = useState({});

  const [material, setMaterial] = useState([]);

  const [materialQuantity, setMaterialQuantity] = useState({});

  const [error, setError] = useState("");

  useEffect(() => {
    setError("");
  }, [itemId, formulaName]);

  useEffect(() => {
    async function loadItems() {
      const res = await axios.get(baseUrl + "/items/list");
      let newDict = {};
      const newItems = res.data.data.map((item) => {
        newDict[item.itemID] = item.name;
        return { value: item.itemID, label: item.name };
      });
      setDict(newDict);
      setItems(newItems);
    }
    loadItems();
  }, []);
  //=========
  const [opened, setOpened] = useState(false);

  const addFormula = async () => {
    if (!itemId || !formulaName) {
      setError("Please enter all fields");
      return false;
    }
    let materialData = [];
    for (let i = 0; i < material.length; i++) {
      materialData.push({
        itemID: material[i],
        amount: materialQuantity[material[i]] || 1,
      });
    }

    const res = await axios.post(baseUrl + "/formula", {
      toItemID: itemId,
      name: formulaName,
      costFormula: costFormula || 0,
      detail: desc,
      material: materialData,
    });
    let formulaId = 0;

    const res2 = await axios.get(baseUrl + "/formula/list");
    for (let i = 0; i < res2.data.data.length; i++) {
      formulaId =
        res2.data.data[i].formulaID > formulaId
          ? res2.data.data[i].formulaID
          : formulaId;
    }
    const res3 = await axios.post(baseUrl + "/formula/materia", {
      formulaID: formulaId,
      material: materialData,
    });

    setOpened(true);
    // window.location.href = "/formula";
  }; //========
  const { data: session, status } = useSession();
  const router = useRouter();

  if (!status) {
    return <LoadingPage />;
  }

  if (status === "unauthenticated") {
    router.push("/api/auth/signin");
  }

  useEffect(() => {
    if (status == "authenticated") {
      // check if role match
      if (session.error == true) {
        router.push("/");
      }

      if ( !(session.role == "manager" || session.role == "storage"  )  ) {
        return {
          redirect: {
            permanent: false,
            destination: "/",
          },
        };
      }
    }
  }, [status]);
  // <Layout session={session}>
  //========

  return (
    <Layout session={session}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "auto",
          minHeight: "200px",
          padding: "20px",
        }}
      >
        <Dialog
          opened={opened}
          withCloseButton
          onClose={() => setOpened(false)}
          size="lg"
          radius="md"
        >
          <Text size="sm" style={{ marginBottom: 10 }} weight={500}>
            Create Complete
          </Text>

          <Group align="flex-end">
            <button
              data-mdb-ripple="true"
              data-mdb-ripple-color="light"
              className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
              onClick={() => {
                // location.href = "/formula";
                router.push("/formula");
              }}
            >
              Back to formula page
            </button>
          </Group>
        </Dialog>

        {/* <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "20px",
            alignItems: "center",
          }}
        >
          <button
            data-mdb-ripple="true"
            data-mdb-ripple-color="light"
            className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-700 active:shadow-lg transition duration-150 ease-in-out"
            // style={{ backgroundColor: "#A0C3D2", marginRight: "10px" }}
            onClick={() => {
              // location.href = "/formula";
              router.push("/formula");
            }}
          >
            {"< Back"}
          </button>

          <Title>สร้างสูตรการผลิต</Title>
        </div> */}
        <div className="flex gap-3 align-middle mb-3">
          <button
            className=""
            onClick={() => {
              router.back();
            }}
          >
            <Chevron direction="left"></Chevron>
          </button>

          <h1 className=" font-bold text-xl">สร้างสูตรการผลิต</h1>
        </div>



        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            width: "50%",
            marginBottom: "auto",
            padding: "20px",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          <Select
            data={items}
            label="สินค้า"
            placeholder="Pick one"
            value={itemId}
            onChange={(event) => {
              setItemId(event);
            }}
          />
          <TextInput
            placeholder="Formula Name"
            label="Formula Name"
            withAsterisk
            value={formulaName}
            onChange={(event) => setFormulaName(event.currentTarget.value)}
          />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              width: "100%",
              minHeight: "100px",
            }}
          >
            <NumberInput
              defaultValue={0.0}
              placeholder="costFormula"
              label="costFormula"
              withAsterisk
              value={costFormula}
              onChange={(event) => {
                setCostFormula(event);
              }}
            />
            <Textarea
              placeholder="รายละเอียด"
              label="รายละเอียด"
              autosize
              minRows={3}
              value={desc}
              onChange={(event) => setDesc(event.currentTarget.value)}
            />
          </div>
          {/* <Title order={5} color="red">
            {error}
          </Title> */}
          <MultiSelect
            data={items}
            label="ส่วนประกอบ/วัตถุดิบ"
            placeholder="Pick one"
            value={material}
            onChange={setMaterial}
          />
          {material.map((item, index) => {
            return (
              <div
                key={"material" + index}
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: "20px",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <NumberInput
                  defaultValue={1}
                  placeholder="จำนวน"
                  label={dict[item]}
                  withAsterisk
                  style={{ width: "100%" }}
                  value={materialQuantity[item]}
                  onChange={(event) => {
                    let newMaterialQuantity = { ...materialQuantity };
                    newMaterialQuantity[item] = event;
                    setMaterialQuantity(newMaterialQuantity);
                  }}
                />
              </div>
            );
          })}
          <Title order={5} color="red">
            {error}
          </Title>
          <button
            data-mdb-ripple="true"
            data-mdb-ripple-color="light"
            className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
            // style={{ backgroundColor: "#A0C3D2", marginRight: "10px" }}
            onClick={() => {
              addFormula();
            }}
          >
            Create
          </button>
        </div>
      </div>
    </Layout>
  );
}
