import React, { useEffect, useState } from "react";
import { GlobalContext } from "../globalContext";
import MkdSDK from "../utils/MkdSDK";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useTable } from "react-table";
import update from "immutability-helper";
import DragHandleIcon from "@mui/icons-material/DragHandle";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { AuthContext } from "../authContext";
import { useNavigate } from "react-router";

const AdminDashboardPage = () => {
  const [list, setList] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(1);
  const { dispatch } = React.useContext(AuthContext);
  const navigate = useNavigate();
  const columns = [
    { Header: "#", accessor: "id" },
    { Header: "Title", accessor: "title" },
    { Header: "Author", accessor: "username" },
    { Header: "Most Liked", accessor: "like" },
  ];
  // const { state, dispatch } = React.useContext(GlobalContext);
  let sdk = new MkdSDK();
  const previousPage = (e) => {
    setList([]);
    setPage((previousValue) => {
      return previousValue - 1;
    });
  };
  const nextPage = (e) => {
    setList([]);
    setPage((previousValue) => {
      return previousValue + 1;
    });
  };
  const logout = () => {
    dispatch({
      type: "LOGOUT",
    });
    navigate("/admin/login", { replace: true });
  };
  useEffect(() => {
    const getData = async (page) => {
      sdk.setTable("video");
      const data = await sdk.callRestAPI(
        { payload: {}, page: page, limit: 10 },
        "PAGINATE"
      );
      console.log(data);
      setList(data.list);
      setTotal(data.num_pages);
    };
    getData(page);
  }, [page]);

  return (
    <>
      <div className="w-full h-fit flex flex-col justify-around items-center text-7xl object-contain overflow-auto text-gray-700 bg-black px-44">
        <div className="w-full flex justify-between items-center mt-11">
          <h1 className="font-black text-5xl text-white ">APP</h1>
          <button
            class="bg-[#9BFF00] text-black py-2 px-4 rounded-full inline-flex items-center text-sm h-10 "
            onClick={logout}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-person"
              viewBox="0 0 16 16"
            >
              {" "}
              <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z" />{" "}
            </svg>
            logout
          </button>
        </div>
        <div className="w-full flex justify-between items-center mt-3">
          <h2 className="font-thin text-4xl text-white ">
            Today's leaderboard
          </h2>
          <div className="w-fit flex bg-[#1D1D1D] text-base px-2 h-14 items-center rounded-2xl">
            <p>30 May 2022</p>
            <p className="ml-2">.</p>
            <button className="bg-[#9BFF00] rounded-full px-2 mr-2 ml-2 text-sm text-black">
              SUBMISSIONS OPEN
            </button>
            <p className="mr-2">.</p>
            <p>11:34</p>
          </div>
        </div>
        {list.length > 0 ? (
          <div className="w-full flex flex-col justify-center items-center">
            <Table columns={columns} data={list} />
            <div className="w-full flex justify-center items-center p-2 m-2">
              <button
                disabled={page <= 1 ? true : false}
                onClick={previousPage}
                class="bg-[#9BFF00] text-black py-2 px-4 rounded-full inline-flex items-center text-sm h-10 mr-2"
              >
                <ArrowBackIosIcon />
              </button>
              <button
                onClick={nextPage}
                disabled={page >= total ? true : false}
                class="bg-[#9BFF00] text-black py-2 px-4 rounded-full inline-flex items-center text-sm h-10 ml-2"
              >
                <ArrowForwardIosIcon />
              </button>
            </div>
          </div>
        ) : (
          <Box sx={{ display: "flex" }} className="mt-11 mb-11">
            <CircularProgress />
          </Box>
        )}
      </div>
    </>
  );
};
const Table = ({ columns, data }) => {
  const [records, setRecords] = React.useState(data);

  const getRowId = React.useCallback((row) => {
    return row.id;
  }, []);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      data: records,
      columns,
      getRowId,
    });
  console.log("headerGroupo>> ", rows);
  const moveRow = (dragIndex, hoverIndex) => {
    const dragRecord = records[dragIndex];
    setRecords(
      update(records, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, dragRecord],
        ],
      })
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <table
        {...getTableProps()}
        className="table-auto  shadow-md   rounded text-base w-full border-spacing-2 border-separate border-spacing-y-4"
      >
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              <th></th>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()} className="text-justify">
                  {column.render("Header")}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, index) => {
            if (row.original.title) {
              return (
                prepareRow(row) || (
                  <Row
                    index={index}
                    row={row}
                    moveRow={moveRow}
                    {...row.getRowProps()}
                  />
                )
              );
            }
          })}
        </tbody>
      </table>
    </DndProvider>
  );
};

const DND_ITEM_TYPE = "row";

const Row = ({ row, index, moveRow }) => {
  const dropRef = React.useRef(null);
  const dragRef = React.useRef(null);

  const [, drop] = useDrop({
    accept: DND_ITEM_TYPE,
    hover(item, monitor) {
      if (!dropRef.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }
      // Determine rectangle on screen
      const hoverBoundingRect = dropRef.current.getBoundingClientRect();
      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      // Determine mouse position
      const clientOffset = monitor.getClientOffset();
      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      // Time to actually perform the action
      moveRow(dragIndex, hoverIndex);
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag, preview] = useDrag({
    item: { index },
    type: DND_ITEM_TYPE,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0 : 1;

  preview(drop(dropRef));
  drag(dragRef);
  console.log("row>>", row);
  return (
    <tr
      ref={dropRef}
      style={{ opacity }}
      className="border border-slate-700 mb-2"
    >
      <td ref={dragRef}>
        <DragHandleIcon className=" rounded-lg w-12 cursor-pointer text-[#9BFF00]" />
      </td>
      {row.cells.map((cell, index) => {
        if (index == 1) {
          return (
            <td {...cell.getCellProps()} className="flex items-center">
              {" "}
              <img
                src={cell.row.original.photo}
                alt=""
                className="w-28 rounded h-24 mr-2 "
              />
              {cell.render("Cell")}
            </td>
          );
        } else if (index == 3) {
          return (
            <td {...cell.getCellProps()}>
              {cell.render("Cell")}{" "}
              <ArrowUpwardIcon className="text-[#9BFF00] pb-1" />
            </td>
          );
        } else if (index == 2) {
          return (
            <td {...cell.getCellProps()}>
              <AccountCircleIcon className="mr-2" />
              {cell.render("Cell")}
            </td>
          );
        }
        return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
      })}
    </tr>
  );
};

export default AdminDashboardPage;
