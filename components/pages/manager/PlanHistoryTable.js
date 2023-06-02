import React, { useEffect, useState, useMemo } from "react";

import { Table, Row, Col, Tooltip, User, Text } from "@nextui-org/react";

// css
import { StyledBadge } from "../../style/StyledBadge";
import { IconButton } from "../../style/IconButton";
import { EyeIcon } from "../../style/EyeIcon";
import { EditIcon } from "../../style/EditIcon";
import { DeleteIcon } from "../../style/DeleteIcon";
import Swal from "sweetalert2";
import { useRouter } from "next/router";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";

export default function MyTable({
  columns,
  dataList,
  setUpdateTable,
  deletePath,
  session,
  role,
  setIsLoad
}) {

/**---------------------------------------------------------------- */
  const router = useRouter();

  const handleDelete = (data) => {

    Swal.fire({
      title: `Do you want to delete ${data.qcID} ?`,
      showCancelButton: true,
      confirmButtonText: "Delete",
    }).then(async (result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        
/*------------------------------------------*/
        //console.log(process.env.NEXT_PUBLIC_API_URL + "/qc" );
        // api delete
        const sendData = { qcID:data.qcID};
        const res = await fetch(
        process.env.NEXT_PUBLIC_API_URL + "/qc/delQC_main"                                           ,
          {
            method: "POST", // *GET, POST, PUT, DELETE, etc.
            mode: "cors", // no-cors, *cors, same-origin
            cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
            credentials: "same-origin", // include, *same-origin, omit
            headers: {
              "Content-Type": "application/json",
              // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: "follow", // manual, *follow, error
            referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body: JSON.stringify(sendData), // body data type must match "Content-Type" header
          }
        );
        const APIdata = await res.json();
        setUpdateTable(true);
        Swal.fire("DELETE!","","success");
      }
    });
  };
  
  const renderCell = (_data, columnKey) => {
    console.log(_data);
    const cellValue = _data[columnKey];
    switch (columnKey) {
      case "createDate":
        const _createDate = new Date(cellValue);1
        let createDate = `${_createDate.getDate()}/${_createDate.getMonth()+1}/${_createDate.getFullYear()}`
        return (
          <div>
            {createDate}
          </div>
        );

        case "startDate":
          const _startDate = new Date(cellValue);1
          let startDate = `${_startDate.getDate()}/${_startDate.getMonth()+1}/${_startDate.getFullYear()}`
          return (
            <div>
              {startDate}
            </div>
          );
          case "endDate":
          const _endDate = new Date(cellValue);1
          let endDate = `${_endDate.getDate()}/${_endDate.getMonth()+1}/${_endDate.getFullYear()}`
          return (
            <div>
              {endDate}
            </div>
          );

      case "actions":
        return (
          <Row justify="center" align="center">
            <Col css={{ d: "flex" }}>
              <Tooltip 
              // content="Details"
              >
                <IconButton
                  onClick={() => {
                    setIsLoad(true);
                    router.push({
                      pathname: "/Manager/Plan/Detail",
                      query: { planID: _data.planID
                      },
                    });
                  }}
                >
                  <EyeIcon size={20} fill="#979797" />
                </IconButton>
              </Tooltip>
            </Col>
          </Row>
        );
      default:
        return cellValue;
    }
  };

 
  
  const itemsPerPage = 10;
  const [page, setPage] = useState(1);
  const displayData = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return dataList.slice (start, start + itemsPerPage);
  }, [dataList, page]);

  return (
    <>
      <div className="overflow-x-auto">
        <Table
          aria-label="Example table with custom cells"
          className="w-full p-2 m-1 appearance-none z-10"
          css={{
            height: "auto",
            minWidth: "100%",
          }}
          selectionMode="none"
        >
          <Table.Header columns={columns}>
            {(column) => (
              <Table.Column
                key={column.uid}
                hideHeader={column.uid === "actions"}
                align={column.uid === "actions" ? "center" : "start"}
              >
                {column.name}
              </Table.Column>
            )}
          </Table.Header>
          <Table.Body items={displayData}>
            {(item) => (
              <Table.Row key={item.role + "_" + item.userID_usersProducer}>
                {(columnKey) => (
                  <Table.Cell>{renderCell(item, columnKey)}</Table.Cell>
                )}
              </Table.Row>
            )}
          </Table.Body>
        </Table>

        {/* paging */}
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
          <div className="flex flex-1 justify-between sm:hidden">
            <a
              href="#"
              className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Previous
            </a>
            <a
              href="#"
              className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Next
            </a>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{page}</span> to{" "}
                <span className="font-medium">
                  {Math.ceil(dataList.length / itemsPerPage)}
                </span>{" "}
                of <span className="font-medium">{dataList.length}</span>{" "}
                results
              </p>
            </div>
            <div>
              <nav
                className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                aria-label="Pagination"
              >
                <a
                  onClick={() => {
                    if (page != 1) setPage(page - 1);
                  }}
                  // href="#"
                  className="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20"
                >
                  <span className="sr-only">Previous</span>
                  <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                </a>

                <a
                  onClick={() => {
                    if (page != Math.ceil(dataList.length/itemsPerPage))
                      setPage(page + 1);
                  }}
                  className="relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20"
                >
                  <span className="sr-only">Next</span>
                  <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                </a>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
