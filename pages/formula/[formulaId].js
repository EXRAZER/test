import { useRouter } from "next/router";
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

import { Chevron } from "../../components/icons";

export default function FormulaDetail() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const [items, setItems] = useState([]);

  const router = useRouter();
  const { formulaId } = router.query;

  const [itemId, setItemId] = useState("");
  const [formulaName, setFormulaName] = useState("");
  const [desc, setDesc] = useState("");
  const [costFormula, setCostFormula] = useState("");

  const [dict, setDict] = useState({});

  const [oldMaterial, setOldMaterial] = useState([]);
  const [oldMaterialQuantity, setOldMaterialQuantity] = useState({});

  const [material, setMaterial] = useState([]);
  const [materialQuantity, setMaterialQuantity] = useState({});

  const [error, setError] = useState("");

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
  useEffect(() => {
    async function loadFormula() {
      const res = await axios.post(baseUrl + "/formula/detail", {
        formulaID: formulaId,
      });

      console.log(res.data.data.detail.costFormula)
      setItemId(res.data.data.detail.toItemID);
      setCostFormula(res.data.data.detail.costFormula);
      setFormulaName(res.data.data.detail.formulaName);
      setDesc(res.data.data.detail.detail);

      let newDict = {};
      setOldMaterial(
        res.data.data.materias.map((item) => {
          newDict[item.itemID] = item.amount || 0;
          return item.itemID;
        })
      );
      setOldMaterialQuantity(newDict);
    }
    if (formulaId) loadFormula();
  }, [formulaId]);

  // =======
  const [opened, setOpened] = useState(false);

  const addFormula = async () => {
    if (!itemId || !formulaName || !costFormula) {
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

    const res = await axios.put(baseUrl + "/formula/detail", {
      formulaID: formulaId,
      NEWname: formulaName,
      NEWcostFormula: costFormula,
      NEWdetail: desc,
    });

    const res2 = await axios.post(baseUrl + "/formula/materia", {
      formulaID: formulaId,
      material: materialData,
    });
    setOpened(true);
  };
  //========
  const { data: session, status } = useSession();
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
      <Dialog
        opened={opened}
        withCloseButton
        onClose={() => setOpened(false)}
        size="lg"
        radius="md"
      >
        <Text size="sm" style={{ marginBottom: 10 }} weight={500}>
          Update Complete
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
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "20px",
            alignItems: "center",
          }}
        >
          {/* <div className="flex gap-3 align-middle mb-3"> */}
            <button
              className=""
              onClick={() => {
                router.back();
              }}
            >
              <Chevron direction="left"></Chevron>
            </button>

            <h1 className=" font-bold text-xl">New Formula</h1>
          {/* </div> */}

          <button
            data-mdb-ripple="true"
            data-mdb-ripple-color="light"
            className=" ml-auto inline-block px-6 py-2.5 bg-rose-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-rose-700 hover:shadow-lg focus:bg-rose-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-rose-800 active:shadow-lg transition duration-150 ease-in-out"
            // style={{ backgroundColor: "#F48484", marginLeft: "auto" }}
            onClick={async () => {
              const res = fetch(baseUrl + "/formula", {
                method: "DELETE",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  formulaID: formulaId,
                }),
              });
              // const res = await axios.delete(baseUrl + "/formula", {
              //   formulaID: formulaId
              // });
              // window.location.href = "/formula";
              router.push("/formula");
            }}
          >
            delete
          </button>
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
            disabled
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
              value={parseInt(costFormula, 10) }
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
            label="สินค้า"
            placeholder="Pick one"
            value={material}
            onChange={setMaterial}
            disabled
          />
          {oldMaterial.map((item, index) => {
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
                  value={oldMaterialQuantity[item]}
                  disabled={true}
                />
              </div>
            );
          })}
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
            // data-mdb-ripple="true"
            // data-mdb-ripple-color="light"
            className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
            // style={{ backgroundColor: "#A0C3D2" }}
            onClick={() => {
              addFormula();
            }}
          >
            Update
          </button>
        </div>
      </div>
    </Layout>
  );
}
