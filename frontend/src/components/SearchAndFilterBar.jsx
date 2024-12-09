import React, { useState } from 'react';
import { Form, Row, Col } from 'react-bootstrap';

const SearchAndFilterBar = ({ onSearch, onSearchInChange, onSortChange, filterOptions }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchInValue, setSearchInValue] = useState('');
    const [sortValue, setSortValue] = useState('');

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        onSearch(value);
    };

    const handleSearchInChange = (e) => {
        const value = e.target.value;
        setSearchInValue(value);
        onSearchInChange(value);
    };

    const handleSortChange = (e) => {
        const value = e.target.value;
        setSortValue(value);
        onSortChange(value);
    };

    return (
        <Row className="mb-3">
            <Col md={4}>
                <Form.Control
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
            </Col>
            <Col md={4}>
                <Form.Select value={searchInValue} onChange={handleSearchInChange}>
                    <option value="">Search in</option>
                    {filterOptions.map(option => (
                        <option key={option} value={option}>
                            {option.charAt(0).toUpperCase() + option.slice(1)}
                        </option>
                    ))}
                </Form.Select>
            </Col>
            <Col md={4}>
                <Form.Select value={sortValue} onChange={handleSortChange}>
                    <option value="">Sort by</option>
                    {filterOptions.map(option => (
                        <option key={option} value={option}>
                            {option.charAt(0).toUpperCase() + option.slice(1)}
                        </option>
                    ))}
                </Form.Select>
            </Col>
        </Row>
    );
};

export default SearchAndFilterBar;
