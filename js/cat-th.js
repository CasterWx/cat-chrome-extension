(function () {
  "use strict";

  $("th.right").css("position", "sticky");
  $("th.right").css("top", "20px");
  $("tr.focus").css("background-color", "red");
  var operate_div = document.getElementById("wrap_search");
  var input_ly = document.createElement("button");
  var t = document.createTextNode("下载");
  input_ly.appendChild(t);
  input_ly.type = "button";
  input_ly.setAttribute("class", "button");
  input_ly.setAttribute("value", "导出");
  input_ly.addEventListener("click", clickDown);
  // input_ly.setAttribute("left", "12px");
  input_ly.setAttribute("font-size", "25px");
  input_ly.setAttribute("height", "22px");
  input_ly.setAttribute("position", "sticky");
  input_ly.setAttribute("top", "15px");
  operate_div.appendChild(input_ly);
  let excHeader = [];
  let excJsonHeader = {};
  let excHeaderStr = "<tr>";
  // 加载表头 #main-container > div.main-content > div:nth-child(2) > div > table.table.table-striped.table-condensed.table-hover > tbody > tr:nth-child(1)
  // <tr><td>姓名</td><td>电话</td><td>邮箱</td></tr>
  var headerBegin = $("table>tbody>tr>th.left");
  for (let index = 0; index < headerBegin.length; index++) {
    const element = headerBegin[index].textContent;
    console.log("element:" + element);
    excHeader.push(element);
    excJsonHeader[element] = element;
    excHeaderStr = excHeaderStr + "<td>" + element + "</td>";
  }
  var header = $("table>tbody>tr>th.right");
  // var header = $("#main-container.dev.dev.dev.table.tbody.tr");
  for (let index = 0; index < header.length; index++) {
    const element = header[index].textContent;
    console.log("element:" + element);
    excHeader.push(element);
    excJsonHeader[element] = element;
    excHeaderStr = excHeaderStr + "<td>" + element + "</td>";
  }
  excHeaderStr += "</tr>";
  // 加载表头 end
  console.log(excHeaderStr);

  let jsonData = [];
  console.log("cat~");
  // 每次添加导出数据 {'id':1,'name':张三,'address':成都}
  $(document).ready(function () {
    $("table>tbody>tr").on("click", function () {
      console.log("click~");
      var value = this.getElementsByTagName("td");
      var jsonItem = {};
      for (let index = 0; index < value.length; index++) {
        const dataValue = value[index].textContent;
        console.log(dataValue);
        var fliedname = excHeader[index];
        jsonItem[fliedname] = dataValue;
      }
      console.log(jsonItem);
      jsonData.push(jsonItem);

      // $(this).parent().find("tr.focus").toggleClass("focus"); //取消原先选中行
      $(this).css("color", "#FFFFFF");
      $(this).css("color", "red");
    });
  });

  function clickDown() {
    // createExcle(excHeader, excJsonHeader, jsonData);
    tableToExcel(excHeaderStr);
    console.log("click down");
  }

  function tableToExcel(str) {
    //列标题
    //循环遍历，每行加入tr标签，每个单元格加td标签
    for (let i = 0; i < jsonData.length; i++) {
      str += "<tr>";
      for (let item in jsonData[i]) {
        //增加\t为了不让表格显示科学计数法或者其他格式
        str += `<td>${jsonData[i][item] + "\t"}</td>`;
      }
      str += "</tr>";
    }
    //Worksheet名
    let worksheet = "Sheet1";
    let uri = "data:application/vnd.ms-excel;base64,";

    //下载的表格模板数据
    let template = `<html xmlns:o="urn:schemas-microsoft-com:office:office" 
    xmlns:x="urn:schemas-microsoft-com:office:excel" 
    xmlns="http://www.w3.org/TR/REC-html40">
    <head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>
      <x:Name>${worksheet}</x:Name>
      <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet>
      </x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
      </head><body><table>${str}</table></body></html>`;
    //下载模板
    window.location.href = uri + base64(template);
  }
  //输出base64编码
  function base64(s) {
    return window.btoa(unescape(encodeURIComponent(s)));
  }
  /**
   *
   * @param cols  数组类型   格式['序号','姓名','地址']
   * @Param colsFiled     格式{'序号':'id','姓名':'name','地址':'address'}
   * @param data  数组类型   格式[{'id':1,'name':张三,'address':成都},{'id':2,'name':李四,'address':成都}]
   * @returns
   */
  function createExcle(cols, colsFiled, data) {
    var table = $("<table></table>");
    var th = $("<tr></tr>");

    var index = 0;

    for (var i = 0; i < data.length; i++) {
      var tr = $("<tr></tr>");
      var values = data[i];

      for (var j = 0; j < cols.length; j++) {
        var fliedName = cols[j];
        var flied = colsFiled[fliedName];
        var value = values[flied];
        var td = $("<td></td>");
        td.html(value);

        if (index == 0) {
          var tdTh = $("<td></td>");
          tdTh.html(fliedName);
          th.append(tdTh);
        }

        tr.append(td);
      }
      if (index == 0) {
        table.append(th);
      }
      table.append(tr);
      index++;
    }
    table.attr("id", "datatab");
    table.attr("style", "display: none");
    table.appendTo("body");
    method5("datatab");

    datatab.remove();
    function method5(tableid) {
      var idTmr;

      var tableToExcel = (function () {
        var uri = "data:application/vnd.ms-excel;base64,",
          template =
            '<html><head><meta charset="UTF-8"></head><body><table>{table}</table></body></html>',
          base64 = function (s) {
            return window.btoa(unescape(encodeURIComponent(s)));
          },
          format = function (s, c) {
            return s.replace(/{(\w+)}/g, function (m, p) {
              return c[p];
            });
          };
        return function (table, name) {
          if (!table.nodeType) table = document.getElementById(table);
          var ctx = {
            worksheet: name || "Worksheet",
            table: table.innerHTML,
          };
          window.location.href = uri + base64(format(template, ctx));
          // var string = uri + base64(format(template, ctx));
          // var iframe =
          //   "<iframe width='100%' height='100%' src='" + string + "'></iframe>";
          // var x = window.open();
          // x.document.open();
          // x.document.write(iframe);
          // x.document.close();
        };
      })();

      if (getExplorer() == "ie") {
        var curTbl = document.getElementById(tableid);
        var oXL = new ActiveXObject("Excel.Application");
        var oWB = oXL.Workbooks.Add();
        var xlsheet = oWB.Worksheets(1);
        var sel = document.body.createTextRange();
        sel.moveToElementText(curTbl);
        sel.select();
        sel.execCommand("Copy");
        xlsheet.Paste();
        oXL.Visible = true;

        try {
          var fname = oXL.Application.GetSaveAsFilename(
            "Excel.xls",
            "Excel Spreadsheets (*.xls), *.xls"
          );
        } catch (e) {
          print("Nested catch caught " + e);
        } finally {
          oWB.SaveAs(fname);
          oWB.Close((savechanges = false));
          oXL.Quit();
          oXL = null;
          idTmr = window.setInterval("Cleanup();", 1);
        }
      } else {
        tableToExcel(tableid);
      }

      function Cleanup() {
        window.clearInterval(idTmr);
        CollectGarbage();
      }

      function getExplorer() {
        var explorer = window.navigator.userAgent;
        //ie
        if (explorer.indexOf("MSIE") >= 0) {
          return "ie";
        }
        //firefox
        else if (explorer.indexOf("Firefox") >= 0) {
          return "Firefox";
        }
        //Chrome
        else if (explorer.indexOf("Chrome") >= 0) {
          return "Chrome";
        }
        //Opera
        else if (explorer.indexOf("Opera") >= 0) {
          return "Opera";
        }
        //Safari
        else if (explorer.indexOf("Safari") >= 0) {
          return "Safari";
        }
      }
    }
  }
})();
