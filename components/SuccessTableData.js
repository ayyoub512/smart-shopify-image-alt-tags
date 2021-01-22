import React from "react";
import { Page, Card, DataTable } from "@shopify/polaris";

function SuccessTableData({ data }) {
    const rows = [
        ["Success", "october 2019", 3, 2],
        ["Success", "october 2019", 3, 2],
        ["Success", "october 2019", 3, 2],
    ];
    return (
        <Card>
            <DataTable
                columnContentTypes={["text", "text", "numeric", "numeric"]}
                headings={["status", "date", "optimized images", "products"]}
                rows={rows}
                totals={["", "", 232, 433]}
                showTotalsInFooter
            />
        </Card>
    );
}

export default SuccessTableData;
