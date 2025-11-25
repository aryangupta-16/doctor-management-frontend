export type Doctor = {
  id: string;
  name: string;
  speciality: string;
  experience: number;
  hospital: string;
  photo: string;
};

export const doctors: Doctor[] = [
  { id: "67344888-1f02-40c4-b077-82b1b46501de", name: "Dr. Aisha Kapoor", speciality: "Cardiologist", experience: 12, hospital: "City Care Hospital", photo: "/avatar1.svg" },
  { id: "67344888-1f02-40c4-b077-82b1b46501de", name: "Dr. Rohan Mehta", speciality: "Dermatologist", experience: 9, hospital: "Skin & Hair Clinic", photo: "/avatar2.svg" },
  { id: "67344888-1f02-40c4-b077-82b1b46501de", name: "Dr. Neha Sharma", speciality: "Pediatrician", experience: 7, hospital: "Sunrise Children Hospital", photo: "/avatar1.svg" },
];
