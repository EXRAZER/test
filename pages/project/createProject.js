import Layout from "../../components/Layout";
import {
  Badge,
  Button,
  Input,
  Select,
  Stepper,
  Table,
  Textarea,
  TextInput,
  Title,
  MultiSelect,
} from "@mantine/core";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { useSession, getSession } from "next-auth/react";
import LoadingPage from "../../components/LoadingPage";
import { Chevron } from "../../components/icons";

export async function getServerSideProps(context) {
  const session = await getSession(context);
  console.log(context.query);
  // console.log(session);

  if (session == undefined) {
    return {
      redirect: {
        permanent: false,
        destination: "/api/auth/signin",
      },
    };
  }

  if (!(session.role == "manager" || session.role == "storage")) {
    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
    };
  }

  const res = await axios.get(process.env.NEXT_PUBLIC_API_URL + "/qc/viewAllQC_main");

  // const APIdata = await res.json();

  if (res.data.error == true) {
    return {
      redirect: {
        permanent: false,
        destination: "/Error",
      },
    };
  }

  let choices = [];
  for(let i of res.data.data){
    choices.push({value: i.qcID, label: i.testName});
  }

  const data = { session: session, choices: choices };

  return {
    props: { data }, // will be passed to the page component as props
  };
}





export default function CreateProject({ data }) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  // console.log(data)
  // const [qcProjectID, setQcProjectID] = useState("");
  const [projectName, setProjectName] = useState("");
  const [desc, setDesc] = useState("");
  const [error, setError] = useState("");

  const [qcItems, setQcItems] = useState(data.choices);
  const [items, setItems] = useState([]);

  const [isClear, setIsClear] = useState(false);


  async function addData() {
    if (projectName == "") {
      setError("Please enter project name");
      return false;
    }
    console.log(items);

    const res = await axios.post(baseUrl + "/qc/project", {
      projectName: projectName,
      detail: desc,
      qcIDs: items,
    });
    setItems([]);
    setProjectName("");
    setDesc("");
    console.log(items);

  }


  //========
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

      if (!(session.role == "manager" || session.role == "storage")) {
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
        {/* <Button
            style={{ backgroundColor: "#A0C3D2", marginRight: "10px" }}
            onClick={() => {
              location.href = "/project";
            }}
          >
            {"< Back"}
          </Button> */}
        {/* <Title>New Test Project</Title> */}
        <div className="flex gap-3 align-middle mb-3">
          <button
            className=""
            onClick={() => {
              router.back();
            }}
          >
            <Chevron direction="left"></Chevron>
          </button>

          <h1 className=" font-bold text-xl">ชุดการทดสอบใหม่</h1>
        </div>
        {/* 
        <Stepper
          // active={qcProjectID ? 1 : 0}
          active={active}
          // onStepClick={setActive}
          breakpoint="sm"
          allowNextStepsSelect={false}
          sx={{ margin: "40px 60px" }}
        >
          <Stepper.Step label="First step" description="Create Project">
            Step 1 Create QC: fill project name amd click "create"

            {step1()}
          </Stepper.Step>
          <Stepper.Step label="Second step" description="Add QC">
            Step 2 Add QC: choose QC to add and click "add" then click "finish"

          </Stepper.Step>
        </Stepper> */}
        <>
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
            <TextInput
              placeholder="Project Name"
              label="Project Name"
              withAsterisk
              value={projectName}
              onChange={(event) => setProjectName(event.currentTarget.value)}
              // disabled={qcProjectID}
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
              <Textarea
                placeholder="รายละเอียด"
                label="รายละเอียด"
                autosize
                minRows={3}
                value={desc}
                onChange={(event) => setDesc(event.currentTarget.value)}
                // disabled={qcProjectID}
              />

              <MultiSelect
                data={qcItems}
                label="ส่วนประกอบ/วัตถุดิบ"
                placeholder="Pick one"
                value={items}
                onChange={setItems}
                clearSearchOnChange = {isClear}
              />

            </div>
            <Title order={5} color="red">
              {error}
            </Title>
              <Button
                // style={{
                //   backgroundColor: "#A0C3D2",
                //   marginRight: "10px",
                // }}
                className=" px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
                onClick={addData}
              >
                create
              </Button>

          </div>
        </>



      </div>
    </Layout>
  );

}


