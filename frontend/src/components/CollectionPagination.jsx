import { Pagination } from 'antd';
import '../styles/CollectionPagination.css';

function CollectionPagination(props) {
    const { currentPage,
            setCurrentPage,
            totalUniqueCards,
            cardsPerPage } = props;

    const handleChange = (page, pageSize) => {
        setCurrentPage(page);
    }

    return (
        <div className="pagination">
            <Pagination
                style={{textAlign: "right", marginBottom: "8px"}}
                current={currentPage}
                total={totalUniqueCards}
                pageSize={cardsPerPage}
                onChange={handleChange}
                size={"small"}
                showSizeChanger={false}
            />
        </div>
    )
}

export default CollectionPagination