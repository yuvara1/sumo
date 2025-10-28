import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import * as XLSX from "xlsx";
import Papa from "papaparse";
import { Upload } from "lucide-react";

export default function DataTable() {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));
  const isSm = useMediaQuery(theme.breakpoints.down("md"));

  const [columns, setColumns] = React.useState([
    { field: "id", headerName: "ID", width: 70, minWidth: 70 },
    { field: "firstName", headerName: "First name", flex: 1, minWidth: 120 },
    { field: "lastName", headerName: "Last name", flex: 1, minWidth: 120 },
    { field: "age", headerName: "Age", type: "number", width: 90, minWidth: 80 },
    {
      field: "fullName",
      headerName: "Full name",
      sortable: false,
      flex: 1.5,
      minWidth: 160,
      valueGetter: (params) => {
        const r = params?.row ?? {};
        return `${r.firstName ?? ""} ${r.lastName ?? ""}`.trim();
      },
    },
  ]);

  const [rows, setRows] = React.useState([
    { id: 1, lastName: "Snow", firstName: "Jon", age: 35 },
    { id: 2, lastName: "Lannister", firstName: "Cersei", age: 42 },
    { id: 3, lastName: "Lannister", firstName: "Jaime", age: 45 },
    { id: 4, lastName: "Stark", firstName: "Arya", age: 16 },
    { id: 5, lastName: "Targaryen", firstName: "Daenerys", age: null },
  ]);
  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: isXs ? 10 : 20,
  });
  const [uploadedFileName, setUploadedFileName] = React.useState("");

  React.useEffect(() => {
    setPaginationModel((m) => ({ ...m, pageSize: isXs ? 15 : 20 }));
  }, [isXs]);

  const fileInputRef = React.useRef(null);

  function normalizeDataToGrid(dataArray) {
    if (!Array.isArray(dataArray) || dataArray.length === 0) {
      setRows([]);
      return;
    }
    const normalized = dataArray.map((r, idx) => ({ id: r.id ?? idx + 1, ...r }));

    const keys = Object.keys(normalized[0] || {});
    const gridCols = keys.map((k) => {
      if (k === "id") return { field: "id", headerName: "ID", width: 70, minWidth: 70 };
      const allNumeric = normalized.every((row) =>
        row[k] === null || row[k] === undefined || row[k] === "" || !isNaN(Number(row[k]))
      );
      return {
        field: k,
        headerName: k.replace(/[_\-]/g, " ").replace(/\b\w/g, (ch) => ch.toUpperCase()),
        minWidth: Math.max(100, String(k).length * 12),
        flex: 1,
        type: allNumeric ? "number" : "string",
      };
    });

    const hasFirst = keys.includes("firstName");
    const hasLast = keys.includes("lastName");
    if (hasFirst && hasLast && !keys.includes("fullName")) {
      gridCols.push({
        field: "fullName",
        headerName: "Full name",
        sortable: false,
        minWidth: 160,
        flex: 1.5,
        valueGetter: (params) => {
          const r = params?.row ?? {};
          return `${r.firstName ?? ""} ${r.lastName ?? ""}`.trim();
        },
      });
    }

    setColumns(gridCols);
    setRows(normalized);
  }

  const handleFile = (file) => {
    if (!file) return;
    const name = file.name.toLowerCase();
    if (name.endsWith(".csv")) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => normalizeDataToGrid(results.data),
        error: (err) => console.error("CSV parse error:", err),
      });
    } else if (name.endsWith(".xls") || name.endsWith(".xlsx")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const ab = e.target.result;
        const workbook = XLSX.read(ab, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(sheet, { defval: null });
        normalizeDataToGrid(json);
      };
      reader.onerror = (err) => console.error("File read error:", err);
      reader.readAsArrayBuffer(file);
    } else {
      console.warn("Unsupported file type. Please upload CSV or Excel.");
    }
  };

  const onFileChange = (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    setUploadedFileName(f.name);
    handleFile(f);
    e.target.value = "";
  };

  const onClickUpload = () => fileInputRef.current?.click();

  const columnVisibilityModel = React.useMemo(() => {
    return {
      id: true,
      firstName: true,
      lastName: !isXs,
      age: !isSm,
      fullName: !isXs,
    };
  }, [isXs, isSm]);

  const gradientHover = {
    background: "linear-gradient(130deg, #ffffff 0%, #b0b6c3 48%, #7c8087ff 100%)",
    color: "#0f172a",
    textTransform: "none",
    fontWeight: 600,
    borderRadius: "12px",
    paddingX: 3,
    paddingY: 1.5,
    boxShadow: "0 14px 30px -16px rgba(15, 23, 42, 0.55)",
    backgroundSize: "160% 160%",
    transition:
      "transform 0.25s ease, box-shadow 0.3s ease, background-position 0.6s ease",
    "&:hover": {
      backgroundPosition: "100% 0%",
      boxShadow: "0 18px 34px -18px rgba(230, 232, 238, 0.6)",
      transform: "translateY(-2px)",
    },
    "&:active": {
      transform: "translateY(0)",
      boxShadow: "0 12px 26px -14px rgba(15, 23, 42, 0.55)",
    },
    "& .MuiSvgIcon-root": {
      filter: "drop-shadow(0 3px 6px rgba(0,0,0,0.25))",
    },
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
        minWidth: 0,
      }}
    >
      <Stack
        direction={isXs ? "column" : "row"}
        spacing={2}
        alignItems={isXs ? "stretch" : "center"}
        sx={{ mb: 3, flexShrink: 0 }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv, .xls, .xlsx"
          onChange={onFileChange}
          style={{ display: "none" }}
        />
        <Button
          variant="contained"
          startIcon={<Upload size={18} />}
          onClick={onClickUpload}
          fullWidth={isXs}
          sx={gradientHover}
        >
          Upload CSV / Excel
        </Button>
        <Typography
          variant="body2"
          sx={{
            whiteSpace: "nowrap",
            color: "#ffffff !important",
          }}
        >
          {isXs ? "Upload .csv, .xls, .xlsx" : "Choose a .csv, .xls or .xlsx file to load into the table."}
        </Typography>
        {uploadedFileName && (
          <Typography
            variant="body2"
            sx={{
              whiteSpace: "nowrap",
              color: "#ffffff",
              opacity: 0.85,
            }}
          >
            Selected file: {uploadedFileName}
          </Typography>
        )}
      </Stack>

      <Paper
        elevation={1}
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          width: "100%",
          minHeight: 0,
          minWidth: 0,
          overflow: "hidden",
          backgroundColor: theme.palette.background.paper,
          borderRadius: 2,
        }}
      
      >
        <Box sx={{ flex: 1, minHeight: 0, minWidth: 0, width: "100%", height: "100%" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            columnVisibilityModel={columnVisibilityModel}
            paginationModel={paginationModel}
            onPaginationModelChange={(model) => setPaginationModel(model)}
            pageSizeOptions={isXs ? [5, 20, 25, 50] : [5, 20, 25, 50, 100]}
            checkboxSelection
            disableRowSelectionOnClick
            sx={{
              width: "100%",
              height: "100%",
              border: "none",
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "#000000 !important",
                borderBottom: "2px solid #1f2937",
                color: "#000000ff",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: 0.4,
              },
              "& .MuiDataGrid-columnHeader, & .MuiDataGrid-columnHeaderTitle": {
                color: "#000000ff",
              },
              "& .MuiDataGrid-main": {
                overflow: "auto",
              },
              "& .MuiDataGrid-virtualScroller": {
                overflow: "auto",
              },
              "& *::-webkit-scrollbar": {
                display: "none",
              },
              "& *": {
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              },
            }}
          />
        </Box>
      </Paper>
    </Box>
  );
}