"use client";

import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, IconButton, CircularProgress, Alert, Button } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import axios from "axios";
import styles from "./page.module.css";

interface Payment {
  id: number;
  name: string;
  age: string;
  address: string;
  cpf: string;
  amountPaid: string;
  birthDate: string;
}

export default function Home() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchPayments(page, rowsPerPage);
  }, [page, rowsPerPage]);

  const fetchPayments = (page: number, rowsPerPage: number) => {
    setLoading(true);
    axios.get(`http://localhost:3001/payments/paginated?page=${page}&limit=${rowsPerPage}`)
      .then((response) => {
        console.log("Dados da API:", response.data);
        setPayments(response.data.payments);
        setTotal(response.data.total);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erro ao buscar dados da API:", error);
        setError("Erro ao buscar dados da API. Verifique se o servidor está em execução.");
        setLoading(false);
      });
  };

  const fetchAllPayments = () => {
    axios.get('http://localhost:3001/payments')
      .then((response) => {
        const allPayments = response.data;
        downloadCSV(allPayments);
      })
      .catch((error) => {
        console.error("Erro ao buscar todos os dados da API:", error);
        setError("Erro ao buscar todos os dados da API. Verifique se o servidor está em execução.");
      });
  };

  const downloadCSV = (data: Payment[]) => {
    const csvRows = [
      ["ID", "Nome", "Idade", "Endereço", "CPF", "Valor Pago", "Nascimento"],
      ...data.map(payment => [
        payment.id,
        payment.name,
        payment.age,
        payment.address,
        payment.cpf,
        payment.amountPaid,
        payment.birthDate
      ])
    ];

    const csvContent = csvRows.map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "payments.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleEdit = (id: number) => {
    const paymentToEdit = payments.find(payment => payment.id === id);
    if (paymentToEdit) {
      const updatedName = prompt("Enter new name (max 15 characters):", paymentToEdit.name);
      if (updatedName === null || updatedName.length > 15) {
        alert("Invalid name. Please ensure the name is not empty and has a maximum of 15 characters.");
        return;
      }

      const updatedAge = prompt("Enter new age:", paymentToEdit.age);
      if (updatedAge === null || isNaN(Number(updatedAge)) || Number(updatedAge) <= 0) {
        alert("Invalid age. Please enter a valid number.");
        return;
      }

      const updatedAddress = prompt("Enter new address:", paymentToEdit.address);
      if (updatedAddress === null || updatedAddress.trim() === "") {
        alert("Invalid address. Please ensure the address is not empty.");
        return;
      }

      const updatedCpf = prompt("Enter new CPF:", paymentToEdit.cpf);
      if (updatedCpf === null || !/^\d{11}$/.test(updatedCpf)) {
        alert("Invalid CPF. Please enter a valid 11-digit CPF.");
        return;
      }

      const updatedAmountPaid = prompt("Enter new amount paid:", paymentToEdit.amountPaid);
      if (updatedAmountPaid === null || isNaN(Number(updatedAmountPaid)) || Number(updatedAmountPaid) <= 0) {
        alert("Invalid amount paid. Please enter a valid number.");
        return;
      }

      const updatedBirthDate = prompt("Enter new birth date (YYYYMMDD):", paymentToEdit.birthDate);
      if (updatedBirthDate === null || !/^\d{8}$/.test(updatedBirthDate)) {
        alert("Invalid birth date. Please enter a valid date in the format YYYYMMDD.");
        return;
      }

      const updatedPayments = payments.map(payment =>
        payment.id === id ? {
          ...payment,
          name: updatedName,
          age: updatedAge,
          address: updatedAddress,
          cpf: updatedCpf,
          amountPaid: updatedAmountPaid,
          birthDate: updatedBirthDate
        } : payment
      );
      setPayments(updatedPayments);
      axios.put(`http://localhost:3001/payments/${id}`, {
        ...paymentToEdit,
        name: updatedName,
        age: updatedAge,
        address: updatedAddress,
        cpf: updatedCpf,
        amountPaid: updatedAmountPaid,
        birthDate: updatedBirthDate
      })
        .then((response) => {
          console.log("Updated payment:", response.data);
        })
        .catch((error) => {
          console.error("Error updating payment:", error);
        });
    }
  };

  const handleDelete = (id: number) => {
    const updatedPayments = payments.filter(payment => payment.id !== id);
    setPayments(updatedPayments);
    axios.delete(`http://localhost:3001/payments/${id}`)
      .then((response) => {
        console.log("Deleted payment:", response.data);
      })
      .catch((error) => {
        console.error("Error deleting payment:", error);
      });
  };

  const formatCpf = (cpf: string) => {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  };

  const formatAmount = (amount: string) => {
    return Number(amount).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  };

  const formatDate = (date: string) => {
    if (!date) {
      return "";
    }
    const year = parseInt(date.slice(0, 4));
    const month = parseInt(date.slice(4, 6));
    const day = parseInt(date.slice(6, 8));
    const parsedDate = new Date(year, month - 1, day);

    return `${parsedDate.getDate()}/${parsedDate.getMonth() + 1}/${parsedDate.getFullYear()}`;
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>Lista de pagamentos</h1>

        <Paper style={{ maxHeight: '90%', overflowY: 'auto' }}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell style={{ width: '50px' }}>ID</TableCell>
                  <TableCell style={{ width: '150px' }}>Nome</TableCell>
                  <TableCell style={{ width: '50px' }}>Idade</TableCell>
                  <TableCell style={{ width: '250px' }}>Endereço</TableCell>
                  <TableCell style={{ width: '150px' }}>CPF</TableCell>
                  <TableCell style={{ width: '150px' }}>Valor Pago</TableCell>
                  <TableCell style={{ width: '150px' }}>Nascimento</TableCell>
                  <TableCell style={{ width: '100px' }}>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell style={{ width: '50px' }}>{payment.id}</TableCell>
                    <TableCell style={{ width: '150px' }}>{payment.name}</TableCell>
                    <TableCell style={{ width: '50px' }}>{Number(payment.age)}</TableCell>
                    <TableCell style={{ width: '250px' }}>{payment.address}</TableCell>
                    <TableCell style={{ width: '150px' }}>{formatCpf(payment.cpf)}</TableCell>
                    <TableCell style={{ width: '150px' }}>{formatAmount(payment.amountPaid)}</TableCell>
                    <TableCell style={{ width: '150px' }}>{formatDate(payment.birthDate)}</TableCell>
                    <TableCell style={{ width: '100px', display: 'flex' }}>
                      <IconButton onClick={() => handleEdit(payment.id)}>
                        <Edit />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(payment.id)}>
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={total}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>

        <div style={{ marginTop: '20px' }}>
          <Button variant="contained" color="primary" onClick={ fetchAllPayments }>
            Download CSV
          </Button>
        </div>
      </main>
    </div>
  );
}
