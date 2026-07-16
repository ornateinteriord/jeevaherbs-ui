import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import {
  Card,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  Typography,
  Button,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  DASHBOARD_CUTSOM_STYLE,
  getHolidaysColumns,
} from "../../../utils/DataTableColumnsProvider";
import { MuiDatePicker } from "../../../components/common/DateFilterComponent";
import { useAddHoliday, useGetHoliday } from "../../../api/Admin";
import { toast } from "react-toastify";
import useSearch from "../../../hooks/SearchQuery";
import { getFormattedDate } from "../../../utils/common";


const Holidays = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newHoliday, setNewHoliday] = useState<{
    date: string | null;
    description: string;
  }>({
    date: null,
    description: "",
  });
  const { data: holidays, isLoading, isError, error } = useGetHoliday();
  useEffect(() => {
    if (isError) {
      toast.error(error.message);
    }
  }, [isError, error]);

    const { searchQuery, setSearchQuery, filteredData } = useSearch(holidays)

    const updateHoliday = useAddHoliday()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateHoliday.mutate({holiday_desc : newHoliday.description,holiday_date:getFormattedDate(newHoliday.date!)})
    setIsModalOpen(false);
    console.log(newHoliday)
  };

  return (
    <>
      <Grid
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        sx={{ margin: "2rem", mt: 12 }}
      >
        <Typography variant="h4">Holiday Details</Typography>
        <Button
          variant="contained"
          onClick={() => setIsModalOpen(true)}
          sx={{
            backgroundColor: "#2c8786",
            "&:hover": { backgroundColor: "#2c8786" },
          }}
        >
          Add Holiday
        </Button>
      </Grid>

      <Card sx={{ margin: "2rem", mt: 2 }}>
        <CardContent>
          <Accordion defaultExpanded>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{
                backgroundColor: "#2c8786",
                color: "#fff",
                "& .MuiSvgIcon-root": { color: "#fff" },
              }}
            >
              List of Holidays
            </AccordionSummary>
            <AccordionDetails>
              <div
                style={{
                  display: "flex",
                  gap: "1rem",
                  justifyContent: "flex-end",
                  marginBottom: "1rem",
                }}
              >
                <TextField
                  size="small"
                  placeholder="Search..."
                  sx={{ minWidth: 200 }}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <DataTable
                columns={getHolidaysColumns()}
                data={filteredData}
                pagination
                progressPending={isLoading || updateHoliday.isPending}
                progressComponent={
                  <CircularProgress size={"4rem"} sx={{ color: "#2c8786" }} />
                }
                customStyles={DASHBOARD_CUTSOM_STYLE}
                paginationPerPage={25}
                paginationRowsPerPageOptions={[25, 50, 100]}
                highlightOnHover
              />
            </AccordionDetails>
          </Accordion>
        </CardContent>
      </Card>

      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        sx={{ zIndex: 1200 }}
      >
        <DialogTitle>Add Holiday</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1, zIndex: 1300 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Description"
                onChange={(e) =>
                  setNewHoliday({ ...newHoliday, description: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <MuiDatePicker
                date={newHoliday.date}
                setDate={(date) => setNewHoliday({ ...newHoliday, date })}
                label="Holiday Date"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Holidays;
