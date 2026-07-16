import { Breadcrumbs, Typography } from "@mui/material";
import { Link } from "react-router-dom";
// import useBreadcrumbs from "use-react-router-breadcrumbs";

export interface breadcrumbsProp {
  path: string;
  breadcrumb: string;
}

interface CustomBreadcrumbsProps {
  routes: breadcrumbsProp[];
  excludePaths?: string[];
}

const CustomBreadcrumbs = ({ routes }: CustomBreadcrumbsProps) => {
  // const breadcrumbs = useBreadcrumbs(routes);

  return (
    routes.length > 0 && (
      <Breadcrumbs separator=">>" aria-label="breadcrumb" sx={{ marginBottom: "1rem", color: "black" }}>
        {routes.map(({ path, breadcrumb }, index, arr) =>
          index !== arr.length - 1 ? (
            <Link key={path} to={path} style={{ textDecoration: "none", color: "inherit" }}>
              {breadcrumb}
            </Link>
          ) : (
            <Typography key={path} color="text.primary">
              {breadcrumb}
            </Typography>
          )
        )}
      </Breadcrumbs>
    )
  );
  
};

export default CustomBreadcrumbs;

