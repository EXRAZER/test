import Layout from "../../components/Layout";
import {
  Button,
  Dialog,
  Group,
  Input,
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
import { useRouter } from "next/router";
import LoadingPage from "../../components/LoadingPage";

import {Chevron} from "../../components/icons"

export default function CreateTestSetting() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  const [error, setError] = useState("");

  const [testName, setTestName] = useState("");
  const [desc, setDesc] = useState("");
  const [type, setType] = useState(null);

  const [valueForTypeMet, setValueForTypeMet] = useState("");

  const dataForTypeMet = [{ value: "seaward", label: "seaward" }];

  const [qcID, setQcID] = useState("");

  const [script_5, setScript_5] = useState("");
  const [script_6, setScript_6] = useState("");
  const [script_7, setScript_7] = useState("");
  const [script_8, setScript_8] = useState("");
  const [script_9, setScript_9] = useState("");
  const [script_10, setScript_10] = useState("");
  const [script_11, setScript_11] = useState("");
  const [script_12, setScript_12] = useState("");
  const [script_13, setScript_13] = useState("");
  const [script_14, setScript_14] = useState("");
  const [script_15, setScript_15] = useState("");
  const [script_16, setScript_16] = useState("");

  const addQc_main = async () => {
    if (!testName || !type) {
      setError("Please fill all fields");
      return;
    }
    const res = await axios.post(baseUrl + "/qc/addQC_main", {
      testName: testName,
      detail: desc,
      type: valueForTypeMet,
    });
    setQcID(res.data.data.qcID);
  };

  const handleAddScript = async () => {
    if (!qcID) {
      setError("Something went wrong, please reload the page and try again");
      return;
    }
    if (
      !script_5 ||
      !script_6 ||
      !script_7 ||
      !script_8 ||
      !script_9 ||
      !script_10 ||
      !script_11 ||
      !script_12
    ) {
      setError("Please fill all fields");
      return;
    }
    if (type == "PowerLeakege") {
      if (!script_13 || !script_14 || !script_15 || !script_16) {
        setError("Please fill all fields");
        return;
      }
    }
    let script_1 = "SSSID_HAL_TEST_TYPE_DCIR";
    if (type == "HiPot") script_1 = "SSSID_HAL_TEST_TYPE_HIPOT_50";
    if (type == "EarthBond") script_1 = "SSSID_HAL_TEST_TYPE_EBOND_50";
    if (type == "PowerLeakege") script_1 = "SSSID_HAL_TEST_TYPE_PWRLK";

    const res = await axios.post(baseUrl + "/qc/addScriptSeaward", {
      qcID: qcID,
      script_1: script_1,
      script_2: "0",
      script_3: "0",
      script_4: "SSSVAL_HAL_TSTART_NONE",
      script_5: script_5,
      script_6: script_6,
      script_7: script_7,
      script_8: script_8,
      script_9: script_9,
      script_10: script_10,
      script_11: script_11,
      script_12: script_12,
      script_13: script_13,
      script_14: script_14,
      script_15: script_15,
      script_16: script_16,
    });
    setTestName("");
    setDesc("");
    setType(null);
    setQcID("");
    setScript_5("");
    setScript_6("");
    setScript_7("");
    setScript_8("");
    setScript_9("");
    setScript_10("");
    setScript_11("");
    setScript_12("");
    setScript_13("");
    setScript_14("");
    setScript_15("");
    setScript_16("");
    setOpened(true);
  };

  useEffect(() => {
    setError("");
  }, [
    script_5,
    script_6,
    script_7,
    script_8,
    script_9,
    script_10,
    script_11,
    script_12,
    script_13,
    script_14,
    script_15,
    script_16,
    testName,
    desc,
    type,
    qcID,
  ]);
  //========
  // const { data: session, status } = useSession();
  // const router = useRouter();

  // if (!status) {
  //   return <LoadingPage />;
  // }

  // if (status === "unauthenticated") {
  //   router.push("/api/auth/signin");
  // }

  // useEffect(() => {
  //   if (status == "authenticated") {
  //     // check if role match
  //     if (session.error == true || session.role != "manager") {
  //       router.push("/");
  //     }
  //   }
  // }, [status]);
  // <Layout session={session}>
  //========
  const [opened, setOpened] = useState(false);

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
      {/* <Layout> */}
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
              // location.href = "/test-setting";
              router.push("/test-setting");
            }}
          >
            Back to test setting
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
        {/* <Button
            style={{
              backgroundColor: "#A0C3D2",
              marginRight: "10px"
            }}
            onClick={() => {
              location.href = "/test-setting";
            }}
          >
            {"< Back"}
          </Button> */}
        {/* <Title>TEST Profile</Title> */}

        <div className="flex gap-3 align-middle mb-3">
          <button
            className=""
            onClick={() => {
              router.back();
            }}
          >
            <Chevron direction="left"></Chevron>
          </button>

          <h1 className=" font-bold text-xl">TEST Profile</h1>
        </div>

        <Stepper
          active={qcID ? 1 : 0}
          breakpoint="sm"
          allowNextStepsSelect={false}
          sx={{ margin: "40px 60px" }}
        >
          <Stepper.Step label="First step" description="Create QC">
            Step 1 Create QC: fill all fields and click "Create QC"
          </Stepper.Step>
          <Stepper.Step label="Second step" description="Add Script">
            Step 2 Add Script: fill all fields that apper and click "Create
            Script"
          </Stepper.Step>
        </Stepper>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "20px",
            alignItems: "center",
            marginTop: "20px",
            padding: "0px 50px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              width: "50%",
              marginBottom: "auto",
            }}
          >
            <TextInput
              placeholder="ชื่อการทดสอบ(Test Name)"
              label="ชื่อการทดสอบ(Test Name)"
              withAsterisk
              value={testName}
              onChange={(event) => setTestName(event.currentTarget.value)}
              disabled={qcID}
            />
            <Select
              label="อุปกรณ์การทดสอบ"
              placeholder="Pick one"
              data={dataForTypeMet}
              value={valueForTypeMet}
              onChange={setValueForTypeMet}
              withAsterisk
              disabled={qcID}
            />
            <Select
              label="Type"
              placeholder="Pick one"
              data={[
                { value: "DCIR", label: "DCIR" },
                { value: "HiPot", label: "HiPot" },
                { value: "EarthBond", label: "EarthBond" },
                { value: "PowerLeakege", label: "PowerLeakege" },
                // DCIR   HiPot   EarthBond   PowerLeakege
              ]}
              value={type}
              onChange={setType}
              withAsterisk
              disabled={qcID}
            />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              width: "50%",
              height: "250px",
            }}
          >
            <Textarea
              placeholder="รายละเอียด"
              label="รายละเอียด"
              autosize
              minRows={3}
              style={{ marginBottom: "auto" }}
              value={desc}
              onChange={(event) => setDesc(event.currentTarget.value)}
              disabled={qcID}
            />
          </div>
        </div>
        <Title order={5} style={{ color: "red", margin: "0px auto" }}>
          {error}
        </Title>
        {!qcID && (
          <Button
            // style={{
            //   backgroundColor: "#A0C3D2",
            //   marginRight: "10px",
            //   width: "100px",
            //   margin: "0px auto",
            // }}
            className=" w-[150px] m-auto inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
            onClick={addQc_main}
          >
            Create QC
          </Button>
        )}
        {qcID && (
          <div
            style={{
              display: "flex",
              width: "400px",
              margin: "0px auto",
              flexDirection: "column",
              gap: "5px",
            }}
          >
            <TextInput
              style={{ width: "100%" }}
              placeholder="output"
              label="output"
              withAsterisk
              value={script_5}
              onChange={(event) => setScript_5(event.currentTarget.value)}
            />
            <TextInput
              style={{ width: "100%" }}
              placeholder="rampUp"
              label="rampUp"
              withAsterisk
              value={script_6}
              onChange={(event) => setScript_6(event.currentTarget.value)}
            />
            <TextInput
              style={{ width: "100%" }}
              placeholder="Dwell"
              label="Dwell"
              withAsterisk
              value={script_7}
              onChange={(event) => setScript_7(event.currentTarget.value)}
            />
            <TextInput
              style={{ width: "100%" }}
              placeholder="TimeToZero"
              label="TimeToZero"
              withAsterisk
              value={script_8}
              onChange={(event) => setScript_8(event.currentTarget.value)}
            />
            <TextInput
              style={{ width: "100%" }}
              placeholder="LowLimit"
              label="LowLimit"
              withAsterisk
              value={script_9}
              onChange={(event) => setScript_9(event.currentTarget.value)}
            />
            <TextInput
              style={{ width: "100%" }}
              placeholder="HighLimit"
              label="HighLimit"
              withAsterisk
              value={script_10}
              onChange={(event) => setScript_10(event.currentTarget.value)}
            />
            <TextInput
              style={{ width: "100%" }}
              placeholder="ArcDetect"
              label="ArcDetect"
              withAsterisk
              value={script_11}
              onChange={(event) => setScript_11(event.currentTarget.value)}
            />
            <TextInput
              style={{ width: "100%" }}
              placeholder="Channel"
              label="Channel"
              withAsterisk
              value={script_12}
              onChange={(event) => setScript_12(event.currentTarget.value)}
            />

            {type == "PowerLeakege" && (
              <>
                <TextInput
                  style={{ width: "100%" }}
                  placeholder="LeakageLowLimit"
                  label="LeakageLowLimit"
                  withAsterisk
                  value={script_13}
                  onChange={(event) => setScript_13(event.currentTarget.value)}
                />
                <TextInput
                  style={{ width: "100%" }}
                  placeholder="PowerHighLimit"
                  label="PowerHighLimit"
                  withAsterisk
                  value={script_14}
                  onChange={(event) => setScript_14(event.currentTarget.value)}
                />
                <TextInput
                  style={{ width: "100%" }}
                  placeholder="PowerLowLimit"
                  label="PowerLowLimit"
                  withAsterisk
                  value={script_15}
                  onChange={(event) => setScript_15(event.currentTarget.value)}
                />
                <TextInput
                  style={{ width: "100%" }}
                  placeholder="LeakageHighLimit"
                  label="LeakageHighLimit"
                  withAsterisk
                  value={script_16}
                  onChange={(event) => setScript_16(event.currentTarget.value)}
                />
              </>
            )}
            <Button
              // style={{
              //   backgroundColor: "#AACB73",
              //   marginRight: "10px",
              //   width: "150px",
              //   margin: "0px auto",
              // }}
              className=" w-[150px] m-auto inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
           
              onClick={handleAddScript}
            >
              Create Script
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
}
