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
} from "@mantine/core";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import LoadingPage from "../../components/LoadingPage";
import { Chevron } from "../../components/icons";

export default function CreateProject() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const [qcProjectID, setQcProjectID] = useState("");
  const [projectName, setProjectName] = useState("");
  const [desc, setDesc] = useState("");
  const [error, setError] = useState("");

  const [qcIdToAdd, setQcIdToAdd] = useState("");

  const [qcAdded, setQcAdded] = useState([]);

  async function addData() {
    if (projectName == "") {
      setError("Please enter project name");
      return false;
    }
    const res = await axios.post(baseUrl + "/qc/addQc_project", {
      projectName: projectName,
      detail: desc,
    });
    setQcProjectID(res.data.data.qcProjectID);
  }
  async function addQc() {
    setQcAdded([...qcAdded, qcIdToAdd]);
    const newQc = qc.filter((item) => {
      return item.value != qcIdToAdd;
    });
    setQc(newQc);
    const res = await axios.post(baseUrl + "/qc/addQcItemProject", {
      qcProjectID: qcProjectID,
      qcID: qcIdToAdd,
    });
    setQcIdToAdd("");
  }

  const [dict, setDict] = useState({});

  const [qc, setQc] = useState([]);
  useEffect(() => {
    async function loadQc() {
      const res = await axios.get(baseUrl + "/qc/viewAllQC_main");

      let newDict = {};
      let newQc = res.data.data.map((item) => {
        newDict[item.qcID] = item.testName;
        return { value: item.qcID, label: item.testName };
      });
      setDict(newDict);
      setQc(newQc);
    }
    loadQc();
  }, []);
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
      if (session.error == true ) {
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

        <Stepper
          active={qcProjectID ? 1 : 0}
          breakpoint="sm"
          allowNextStepsSelect={false}
          sx={{ margin: "40px 60px" }}
        >
          <Stepper.Step label="First step" description="Create Project">
            Step 1 Create QC: fill project name amd click "create"
          </Stepper.Step>
          <Stepper.Step label="Second step" description="Add QC">
            Step 2 Add QC: choose QC to add and click "add" then click "finish"
          </Stepper.Step>
        </Stepper>
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
            disabled={qcProjectID}
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
              disabled={qcProjectID}
            />
          </div>
          <Title order={5} color="red">
            {error}
          </Title>
          {qcProjectID == "" && (
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
          )}
          {qcProjectID != "" && (
            <>
              <div
                style={{
                  display: "flex",
                  width: "auto",
                  margin: "0px auto",
                  flexDirection: "row",
                  gap: "10px",
                }}
              >
                {qcAdded.map((item) => {
                  return <Badge>{dict[item]}</Badge>;
                })}
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: "20px",
                  width: "100%",
                }}
              >
                <Select
                  data={qc}
                  placeholder={"choose qc to add"}
                  style={{ width: "100%" }}
                  value={qcIdToAdd}
                  onChange={(event) => {
                    setQcIdToAdd(event);
                  }}
                />
                <Button
                  // style={{
                  //   backgroundColor: "#A0C3D2",
                  //   marginRight: "10px",
                  // }}
                  className=" px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
                  onClick={addQc}
                >
                  add
                </Button>
              </div>

              <Button
                // style={{ backgroundColor: "#A0C3D2", marginRight: "10px" }}
                className=" px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
                onClick={() => {
                  // location.href = "/project";
                  router.push("/project");
                }}
              >
                Finish
              </Button>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}
