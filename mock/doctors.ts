export type Doctor = {
  id: string;
  name: string;
  speciality: string;
  experience: number;
  hospital: string;
  photo: string;
};

export const doctors: Doctor[] = [
  { id: "d1", name: "Dr. Aisha Kapoor", speciality: "Cardiologist", experience: 12, hospital: "City Care Hospital", photo: "/avatar1.svg" },
  { id: "d2", name: "Dr. Rohan Mehta", speciality: "Dermatologist", experience: 9, hospital: "Skin & Hair Clinic", photo: "/avatar2.svg" },
  { id: "d3", name: "Dr. Neha Sharma", speciality: "Pediatrician", experience: 7, hospital: "Sunrise Children Hospital", photo: "/avatar1.svg" },
];
