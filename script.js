var token = '90934543|-31949209746192862|90958991'; //replace with your token 
var dbname = 'DELIVERY-DB';
var relation = "SHIPMENT-TABLE";
var baseUrl = "http://api.login2explore.com:5577";

function resetForm() {
    $("#shipmentNo").val('');
    $("#description").val('');
    $("#source").val('');
    $("#destination").val('');
    $("#shippingDate").val('');
    $("#expectedDate").val('');
}

function disableAll() {
    resetForm();
    $("#shipmentNo").prop("disabled", false).focus();
    $("#description").prop("disabled", true);
    $("#source").prop("disabled", true);
    $("#destination").prop("disabled", true);
    $("#shippingDate").prop("disabled", true);
    $("#expectedDate").prop("disabled", true);
    $("#saveBtn").prop("disabled", true);
    $("#updateBtn").prop("disabled", true);
}

disableAll();

function executeCommand(reqString, apiEndPointUrl) {
    var url = baseUrl + apiEndPointUrl;
    var jsonObj;

    $.ajax({
        url: url,
        type: 'POST',
        data: reqString,
        async: false,
        success: function (result) {
            jsonObj = JSON.parse(result);
        },
        error: function (result) {
            var dataJsonObj = result.responseText;
            jsonObj = JSON.parse(dataJsonObj);
        }
    });

    return jsonObj;
}

function createGET_BY_KEYRequest(token, dbname, relationName, jsonObjStr) {
    var value1 = "{\n"
        + "\"token\" : \"" + token + "\",\n"
        + "\"cmd\" : \"GET_BY_KEY\",\n"
        + "\"dbName\": \"" + dbname + "\",\n"
        + "\"rel\" : \"" + relationName + "\",\n"
        + "\"jsonStr\": " + jsonObjStr + "\n"
        + "}";
    return value1;
}

function findShipment(ele) {
    var shipNo = ele.value;
    var obj = { "Shipment-No.": shipNo };
    var jsnobj = JSON.stringify(obj);
    var request = createGET_BY_KEYRequest(token, dbname, relation, jsnobj);

    $.ajaxSetup({ async: false });
    var res = executeCommand(request, "/api/irl");
    $.ajaxSetup({ async: true });

    if (res.status === 400) {
        $("#description, #source, #destination, #shippingDate, #expectedDate").prop("disabled", false);
        $("#description").focus();
        $("#saveBtn, #resetBtn").prop("disabled", false);
    } else {
        var data = JSON.parse(res.data).record;
        $("#shipmentNo").prop("disabled", true);
        $("#description").prop("disabled", false).val(data.Description);
        $("#source").prop("disabled", false).val(data.Source);
        $("#destination").prop("disabled", false).val(data.Destination);
        $("#shippingDate").prop("disabled", false).val(data["Shipping-Date"]);
        $("#expectedDate").prop("disabled", false).val(data["Expected-Delivery-Date"]);

        $("#updateBtn, #resetBtn").prop("disabled", false);
        $("#saveBtn").prop("disabled", true);
    }
}

function createPUTRequest(connToken, jsonObj, dbName, relName) {
    return JSON.stringify({
        token: connToken,
        cmd: "PUT",
        dbName: dbName,
        rel: relName,
        jsonStr: JSON.parse(jsonObj)
    });
}

function saveData() {
    var shipmentNo = $("#shipmentNo").val();
    var description = $("#description").val();
    var source = $("#source").val();
    var destination = $("#destination").val();
    var shipDate = $("#shippingDate").val();
    var expectedDate = $("#expectedDate").val();

    if (!shipmentNo || !description || !source || !destination || !shipDate || !expectedDate) {
        alert("Please fill out all fields.");
        return;
    }

    var obj = {
        "Shipment-No.": shipmentNo,
        "Description": description,
        "Source": source,
        "Destination": destination,
        "Shipping-Date": shipDate,
        "Expected-Delivery-Date": expectedDate
    };

    var jsonobj = JSON.stringify(obj);
    var req = createPUTRequest(token, jsonobj, dbname, relation);

    $.ajaxSetup({ async: false });
    var res = executeCommand(req, "/api/iml");
    $.ajaxSetup({ async: true });

    alert("Saved Successfully");
    disableAll();
}

function createSETRequest(token, jsonStr, dbName, relName, type, primaryKey) {
    return JSON.stringify({
        token: token,
        cmd: "SET",
        dbName: dbName,
        rel: relName,
        type: type || "DEFAULT",
        jsonStr: JSON.parse(jsonStr),
        primaryKey: primaryKey
    });
}

function updateData() {
    var shipmentNo = $("#shipmentNo").val();
    var description = $("#description").val();
    var source = $("#source").val();
    var destination = $("#destination").val();
    var shipDate = $("#shippingDate").val();
    var expectedDate = $("#expectedDate").val();

    if (!description || !source || !destination || !shipDate || !expectedDate) {
        alert("All fields must be filled.");
        return;
    }

    var obj = {
        "Shipment-No.": shipmentNo,
        "Description": description,
        "Source": source,
        "Destination": destination,
        "Shipping-Date": shipDate,
        "Expected-Delivery-Date": expectedDate
    };

    var jsonobj = JSON.stringify(obj);
    var req = createSETRequest(token, jsonobj, dbname, relation, "UPDATE", "Shipment-No.");

    $.ajaxSetup({ async: false });
    var res = executeCommand(req, "/api/iml/set");
    $.ajaxSetup({ async: true });

    alert("Updated Successfully");
    disableAll();
}
