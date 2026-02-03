import {
  Card,
  CardContent,
  Typography,
  Grid,
  Avatar,
  Box
} from "@mui/material";

const suppliers = [
  {
    name: "ABC Electronics",
    email: "info@abcelectronics.com",
    mobile: "+91 98765 43210",
    logo: "https://via.placeholder.com/80?text=ABC"
  },
  {
    name: "Bright Supplies",
    email: "info@brightsupplies.com",
    mobile: "+91 91234 56789",
    logo: "https://via.placeholder.com/80?text=BS"
  },
  {
    name: "Smart Traders",
    email: "sales@smarttraders.com",
    mobile: "+91 99887 77665",
    logo: "https://via.placeholder.com/80?text=ST"
  },
  {
    name: "Global Tech",
    email: "support@globaltech.com",
    mobile: "+91 90123 45678",
    logo: "https://via.placeholder.com/80?text=GT"
  },
  {
    name: "NextGen Distributors",
    email: "hello@nextgen.com",
    mobile: "+91 93456 78901",
    logo: "https://via.placeholder.com/80?text=NG"
  },
];

const stringToColor = (string) => {
  let hash = 0;
  for (let i = 0; i < string.length; i++) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = "#";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += (`00${value.toString(16)}`).slice(-2);
  }
  return color;
};

export function Suppliers() {
  return (
    <Box p={3}>
      <Typography variant="h5" mb={2}>
        Suppliers
      </Typography>

      <Grid container spacing={3}>
        {suppliers.map((s, i) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
            <Card
              sx={{
                height: "100%",
                borderRadius: 3,
                boxShadow: 3,
                textAlign: "center",
                p: 2,
                transition: "0.3s",
                "&:hover": { transform: "scale(1.03)" }
              }}
            >
              <Avatar
                src={s.logo}
                sx={{
                  width: 80,
                  height: 80,
                  margin: "0 auto",
                  mb: 2,
                  bgcolor: stringToColor(s.name),
                  fontSize: 50
                }}
              >
                {s.name.charAt(0)}
              </Avatar>


              <CardContent>
                <Typography variant="h6">{s.name}</Typography>
                <Typography color="text.secondary">{s.email}</Typography>
                <Typography color="text.secondary">{s.mobile}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
