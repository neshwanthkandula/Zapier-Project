export function ParseData(filter: string, data: Record<string, any>): string {
    let finalData = "";
    let tempData = "";
    let flag = false;

    for (let i = 0; i < filter.length; i++) {
        const char = filter[i];

        if (char === "(") {
            flag = true;   // start capturing path
            tempData = "";
        } else if (char === ")") {
            flag = false;  // end capturing path

            // Resolve the path in `data`
            const keys = tempData.split(".");
            let value: any = data;

            for (const key of keys) {
                if (value && key in value) {
                    value = value[key];
                } else {
                    value = ""; // missing key → empty string
                    break;
                }
            }

            finalData += value;
            tempData = "";
        } else if (flag) {
            tempData += char; // accumulate path
        } else {
            finalData += char; // normal text
        }
    }

    console.log(finalData);
    return finalData;
}

// const a = "hii (comment.username), you got bunty of (comment.amount)!!!";
// const b = {
//     comment: {
//         username: "luffy",
//         amount: "10"
//     }
// };

// const result = ParseData(a, b);
// console.log(result);
// // Output: "hii luffy, you got bunty of 10!!!"
