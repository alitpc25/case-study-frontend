import React, { useEffect, useState } from "react";
import { BsArrowUpShort, BsArrowDownShort } from "react-icons/bs"
import { Modal, Button } from 'react-bootstrap';
import axios from "axios";
import NavbarComponent from "../components/NavbarComponent";
import { Table } from 'react-bootstrap';
import { ToastContainer } from 'react-toastify';
import { Link } from "react-router-dom"
import { Formik, Form, Field, ErrorMessage } from "formik"
import MyPhoneInput from "../components/MyPhoneInput";
import PaginateComponent from "../components/PaginateComponent";
import { toastSuccess, toastError } from "../utils/toastMessages";
import { UpdateCandidateSchema } from "../utils/yupSchemas";
import { initialValuesCandidate } from "../utils/formikInitialValues";

function Home() {

    const [candidates, setCandidates] = useState([]);

    // Refetch if candidates changed.
    const [isCandidatesChanged, setIsCandidatesChanged] = useState(false)

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

    const updateCandidate = async (values) => {
        try {
            const response = await axios.patch(`/api/v1/candidates/updateInfo/${selectedCandidate.id}`,values);
            handleCloseEditModal();
            toastSuccess("Candidate " + response.data.name + " successfully edited.");
        } catch (error) {
            console.log(error);
            toastError(error.response.data);
        } finally {
            setIsCandidatesChanged(true);
        }
    }

    const handlePageClick = (e) => {
        setCurrentPage(e.selected + 1)
        setIsCandidatesChanged(true)
    }

    const [currentPage, setCurrentPage] = useState(1);
    const candidatesPerPage = 9;
    const [pageNumber, setPageNumber] = useState(1); // total page number
    const [sortedByState, setSortedByState] = useState(null);
    const [sortOrderState, setSortOrderState] = useState(null);

    const getCandidates = async (currentPage, candidatesPerPage) => {
        try {
            const response = await axios.get(`/api/v1/candidates?page=${currentPage}&size=${candidatesPerPage}`);
            setCandidates(response.data.content);
            setCurrentPage(response.data.number + 1);
            setPageNumber(parseInt(response.data.totalPages));
        } catch (error) {
            if (error.response.status === 404) {
                console.log(setCandidates([]));
            }
        }
    }

    const handleDeleteCandidate = (candidateId) => {
        axios.delete(`/api/v1/candidates/${candidateId}`)
            .then(function (response) {
                toastSuccess("Candidate successfully removed.");
                handleCloseDeleteModal()
            })
            .catch(function (error) {
                if (error.response.status === 404) {
                    console.log(setCandidates([]))
                }
                toastError(error.response.data);
            })
            .finally(() => {
                setIsCandidatesChanged(true)
            })
    }

    // Sort requests

    const getCandidatesSorted = async (currentPage, candidatesPerPage, sortedBy, sortOrder) => {
        try {
            const response = await axios.get(`/api/v1/candidates?page=${currentPage}&size=${candidatesPerPage}&sortedBy=${sortedBy}&sortOrder=${sortOrder}`);
            setCandidates(response.data.content);
            setCurrentPage(response.data.number + 1);
            setPageNumber(parseInt(response.data.totalPages));
        } catch (error) {
            if (error.response.status === 404) {
                console.log(setCandidates([]));
            }
        }
    }

    const handleSort = (e, sortedBy, sortOrder) => {
        setSortedByState(sortedBy)
        setSortOrderState(sortOrder)
        getCandidatesSorted(currentPage, candidatesPerPage, sortedBy, sortOrder);
    }

    const [searchKey, setSearchKey] = useState("");

    const handleSearch = (e) => {
        e.preventDefault()
        const nameAndSurname = searchKey.split(" ")
        nameAndSurname[1] = (nameAndSurname[1] === undefined) ? "" : nameAndSurname[1] 
        axios.get(`/api/v1/candidates?page=${currentPage}&size=${candidatesPerPage}&name=${nameAndSurname[0]}&surname=${nameAndSurname[1]}`)
        .then((response) => {
            setCandidates(response.data.content);
            setCurrentPage(response.data.number + 1);
            setPageNumber(parseInt(response.data.totalPages));
        }).catch(function (error) {
            if (error.response.status === 404) {
                console.log(setCandidates([]))
            }
            toastError(error.response.data);
        })
    }

    const tableHeaders = ["Name", "Surname", "Phone", "Mail", "Status", "Operations"]

    useEffect(() => {
        if (sortedByState === null || sortOrderState === null) {
            getCandidates(currentPage, candidatesPerPage);
        } else {
            getCandidatesSorted(currentPage, candidatesPerPage, sortedByState, sortOrderState)
        }
        setIsCandidatesChanged(false)

    }, [isCandidatesChanged, currentPage, sortOrderState, sortedByState])

    return (
        <div>
            <NavbarComponent addButtonName="New Candidate" setIsCandidatesChanged={setIsCandidatesChanged}></NavbarComponent>
            <div className="d-flex justify-content-evenly p-2" >
                <PaginateComponent handlePageClick={handlePageClick} pageNumber={pageNumber} />
                    <form className="form-inline d-flex flex-row">
                        <input className="form-control mr-sm-2" type="search" placeholder="Enter name surname" aria-label="Search" onChange={(e) => setSearchKey(e.target.value)} />
                        <button disabled={(searchKey === "" || searchKey === undefined) ? true : false} className="btn btn-outline-success my-2 my-sm-0" onClick={handleSearch}>Search</button>
                    </form>
            </div>
            <div>
                <ToastContainer className="mt-4" />
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            {tableHeaders.map(headerName => {
                                return (<th scope="col" className="px-6 ">
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
                        {candidates.map(c => {
                            return (
                                <tr id={c.id}>
                                    <td className="px-6 pt-3">
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
                            initialValues={initialValuesCandidate}
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