import React, { useEffect, useState } from "react";
import { BsArrowUpShort, BsArrowDownShort } from "react-icons/bs"
import { Modal, Button } from 'react-bootstrap';
import axios from "axios";
import NavbarComponent from "../components/NavbarComponent";
import { Table } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import { Link } from "react-router-dom"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from 'yup';
import MyPhoneInput from "../components/MyPhoneInput";
import PaginateComponent from "../components/PaginateComponent";
import {toastSuccess, toastError} from "../utils/toastMessages.js"
import * as api from "../api/index.js"

function Home() {

    const [candidates, setCandidates] = useState([]);

    const [selectedCandidate, setSelectedCandidate] = useState({
        id: "",
        name: "",
        surname: "",
        mail: "",
        phone: "",
        status: "" 
    })

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    //Modal open-close control
    const handleCloseDeleteModal = () => setShowDeleteModal(false);
    const handleCloseEditModal = () => setShowEditModal(false);

    const handleShowDeleteModal = (event, candidateInfo) => {
        setSelectedCandidate(candidateInfo)
        setShowDeleteModal(true);
    }

    const handleShowEditModal = (event, candidateInfo) => {
        setSelectedCandidate(candidateInfo)
        setShowEditModal(true);
    }

    const initialValues = {
        mail: selectedCandidate.mail,
        phone: selectedCandidate.phone,
        status: selectedCandidate.status
    };

    const UpdateCandidateSchema = Yup.object().shape({
        mail: Yup.string().email().required("Mail is required"),
        phone: Yup.string().required("Phone is required"),
        status: Yup.string().required("Status is required")
    });

    const updateCandidate = async (values) => {
        api.updateCandidate(values, selectedCandidate.id)
        handleCloseEditModal();
    }

    const handlePageClick = (e) => {
        setCurrentPage(e.selected + 1)
    }

    const [currentPage, setCurrentPage] = useState(1);
    const [candidatesPerPage, setCandidatesPerPage] = useState(9);
    const [pageNumber, setPageNumber] = useState(1); // total page number
    const [sortedByState, setSortedByState] = useState(null);
    const [sortOrderState, setSortOrderState] = useState(null);

    const getCandidates = async (currentPage, candidatesPerPage) => {
        const response = await api.getAllCandidates(currentPage, candidatesPerPage);
        setCandidates(response.data.content);
        setCurrentPage(response.data.number + 1);
        setPageNumber(parseInt(response.data.totalPages));
    }

    const handleDeleteCandidate = (candidateId) => {
        handleCloseDeleteModal()
        setCandidates((prev) => prev.filter(item => item.id !== candidateId))
        api.deleteCandidate(candidateId)
    }

    // Sort requests

    const getCandidatesSorted = async (currentPage, candidatesPerPage, sortedBy, sortOrder) => {
        const response = await api.getAllCandidatesSorted(currentPage, candidatesPerPage, sortedBy, sortOrder);
        setCandidates(response.data.content);
        setCurrentPage(response.data.number + 1);
        setPageNumber(parseInt(response.data.totalPages));
    }

    const handleSort = (e, sortedBy, sortOrder) => {
        setSortedByState(sortedBy)
        setSortOrderState(sortOrder)
        getCandidatesSorted(currentPage, candidatesPerPage, sortedBy, sortOrder);
    }

    const [searchKey, setSearchKey] = useState("");

    const handleSearch = async (e) => {
        e.preventDefault()
        const nameAndSurname = searchKey.split(" ")
        nameAndSurname[1] = (nameAndSurname[1] == undefined) ? "" : nameAndSurname[1] 
        const response = await api.findCandidateByNameAndSurname(currentPage, candidatesPerPage, nameAndSurname[0], nameAndSurname[1])
        setCandidates(response.data.content);
        setCurrentPage(response.data.number + 1);
        setPageNumber(parseInt(response.data.totalPages));
    }

    const tableHeaders = ["Name", "Surname", "Phone", "Mail", "Status", "Operations"]

    useEffect(() => {
        if (sortedByState == null || sortOrderState == null) {
            getCandidates(currentPage, candidatesPerPage);
        } else {
            getCandidatesSorted(currentPage, candidatesPerPage, sortedByState, sortOrderState)
        }

    }, [currentPage])

    return (
        <div>
            <NavbarComponent addButtonName="New Candidate" setCandidates={setCandidates}></NavbarComponent>
            <div className="d-flex justify-content-evenly p-2" >
                <PaginateComponent handlePageClick={handlePageClick} pageNumber={pageNumber} />
                    <form className="form-inline d-flex flex-row">
                        <input className="form-control mr-sm-2" type="search" placeholder="Enter name surname" aria-label="Search" onChange={(e) => setSearchKey(e.target.value)} />
                        <button disabled={(searchKey == "" || searchKey == undefined) ? true : false} className="btn btn-outline-success my-2 my-sm-0" onClick={handleSearch}>Search</button>
                    </form>
            </div>
            <div>
                <ToastContainer className="mt-4" />
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            {tableHeaders.map((headerName, i) => {
                                return (<th key={i} scope="col" className="px-6 ">
                                    <div className="flex items-center">
                                        {headerName}
                                        {(headerName === "Name" || headerName === "Surname" || headerName === "Status") ? <>
                                            <BsArrowUpShort onClick={(event) => handleSort(event, headerName.toLowerCase(), "DESC")} size={25}></BsArrowUpShort>
                                            <BsArrowDownShort onClick={(event) => handleSort(event, headerName.toLowerCase(), "ASC")} size={25}></BsArrowDownShort>
                                        </>
                                            : null}
                                    </div>
                                </th>)
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {candidates.map((c, i) => {
                            return (
                                <tr id={i}>
                                    <td scope="row" className="px-6 pt-3">
                                        {c.name}
                                    </td>
                                    <td className="px-6 pt-3">
                                        {c.surname}
                                    </td>
                                    <td className="px-6 pt-3">
                                        {c.phone}
                                    </td>
                                    <td className="px-6 pt-3">
                                        {c.mail}
                                    </td>
                                    <td className="px-6 pt-3">
                                        {c.status}
                                    </td>
                                    <td className="px-6 text-right">
                                        <div className="d-flex align-items-center justify-content-evenly">
                                            <Link to="/interactions" state={{ candidateId: c.id }}>
                                                <button type="button" className="btn btn-primary">Details</button></Link>
                                            <button onClick={(event) => handleShowEditModal(event, c)} type="button" className="btn btn-primary">Edit</button>
                                            <button onClick={(event) => handleShowDeleteModal(event, c)} type="button" className="btn btn-danger">Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })
                        }
                    </tbody>
                </Table>

                <Modal centered show={showDeleteModal} onHide={handleCloseDeleteModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Are you sure?</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Remove candidate {selectedCandidate.name} {selectedCandidate.surname}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="danger" onClick={() => handleDeleteCandidate(selectedCandidate.id)}>
                            Remove
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Modal centered show={showEditModal} onHide={handleCloseEditModal} className="modal-lg">
                    <Modal.Header closeButton>
                        <Modal.Title>Edit candidate {selectedCandidate.name} {selectedCandidate.surname}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Formik
                            initialValues={initialValues}
                            validationSchema={UpdateCandidateSchema}
                            onSubmit={(values) => {
                                updateCandidate(values)
                            }}
                        >
                            {() => (
                                <Form className=''>
                                    <div className=''>
                                        <label htmlFor="mail">Mail</label>
                                        <div className='p-2'>
                                            <Field type="text" name="mail" className='form-control' />
                                            <ErrorMessage name="mail" component="div" />
                                        </div>
                                    </div>
                                    <div className=''>
                                        <label htmlFor="phone">Phone</label>
                                        <div className='p-2'>
                                            <MyPhoneInput name="phone"></MyPhoneInput>
                                            <ErrorMessage name="phone" component="div" />
                                        </div>
                                    </div>
                                    <div className=''>
                                        <label htmlFor="status">Status</label>
                                        <div className='p-2'>
                                            <Field name="status" as="select" className="form-control form-select">
                                                <option>Sourced</option>
                                                <option>Interviewing</option>
                                                <option>Offer sent</option>
                                                <option>Hired</option>
                                            </Field>
                                            <ErrorMessage name="status" component="div" />
                                        </div>
                                    </div>
                                    <div className="d-flex justify-content-around">
                                        <Button variant="secondary" onClick={handleCloseEditModal}>
                                            Close
                                        </Button>
                                        <Button variant="primary" type="submit">
                                            Update candidate
                                        </Button>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </Modal.Body>
                </Modal>
            </div>
        </div>
    )
}


export default Home;