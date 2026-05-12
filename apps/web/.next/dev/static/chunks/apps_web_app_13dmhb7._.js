(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/apps/web/app/hooks/useAppaltoVoci.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAppaltoVoci",
    ()=>useAppaltoVoci
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.2.6_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
'use client';
;
function useAppaltoVoci(baseUrl, selectedCommessaId, setError) {
    _s();
    const [appaltoRows, setAppaltoRows] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [collapsedAppaltoIds, setCollapsedAppaltoIds] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(new Set());
    const [isSavingAppalto, setIsSavingAppalto] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const fetchAppaltoVoci = async (commessaId)=>{
        try {
            const res = await fetch(`${baseUrl}/api/commesse/${commessaId}/appalto-voci`);
            if (!res.ok) throw new Error('Impossibile recuperare le voci in appalto');
            const data = await res.json();
            setAppaltoRows(data.map((row)=>({
                    id: row.id,
                    parentId: row.parentId ?? null,
                    descrizione: row.descrizione || '',
                    unitaMisura: row.unitaMisura || '',
                    quantita: row.quantita?.toString?.() || '',
                    prezzoUnitario: row.prezzoUnitario?.toString?.() || '',
                    avanzamentoPercent: row.avanzamentoPercent?.toString?.() || ''
                })));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Impossibile recuperare le voci in appalto');
        }
    };
    const handleAddAppaltoRow = ()=>{
        setAppaltoRows((prev)=>[
                ...prev,
                {
                    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
                    parentId: null,
                    descrizione: '',
                    unitaMisura: '',
                    quantita: '',
                    prezzoUnitario: '',
                    avanzamentoPercent: ''
                }
            ]);
    };
    const handleAddAppaltoChildRow = (parentId)=>{
        setAppaltoRows((prev)=>[
                ...prev,
                {
                    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
                    parentId,
                    descrizione: '',
                    unitaMisura: '',
                    quantita: '',
                    prezzoUnitario: '',
                    avanzamentoPercent: ''
                }
            ]);
    };
    const handleUpdateAppaltoRow = (rowId, field, value)=>{
        setAppaltoRows((prev)=>prev.map((row)=>row.id === rowId ? {
                    ...row,
                    [field]: value
                } : row));
    };
    const handleRemoveAppaltoRow = (rowId)=>{
        setAppaltoRows((prev)=>{
            const toRemove = new Set();
            const collect = (id)=>{
                toRemove.add(id);
                prev.filter((row)=>row.parentId === id).forEach((row)=>collect(row.id));
            };
            collect(rowId);
            return prev.filter((row)=>!toRemove.has(row.id));
        });
    };
    const toggleAppaltoRow = (rowId)=>{
        setCollapsedAppaltoIds((prev)=>{
            const next = new Set(prev);
            if (next.has(rowId)) {
                next.delete(rowId);
            } else {
                next.add(rowId);
            }
            return next;
        });
    };
    const appaltoRowsFlat = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useAppaltoVoci.useMemo[appaltoRowsFlat]": ()=>{
            const byParent = new Map();
            for (const row of appaltoRows){
                const key = row.parentId ?? null;
                const group = byParent.get(key) ?? [];
                group.push(row);
                byParent.set(key, group);
            }
            const totalsMap = new Map();
            const computeTotals = {
                "useAppaltoVoci.useMemo[appaltoRowsFlat].computeTotals": (row)=>{
                    const children = byParent.get(row.id) ?? [];
                    if (children.length === 0) {
                        const quantita = parseFloat(row.quantita.replace(',', '.')) || 0;
                        const prezzo = parseFloat(row.prezzoUnitario.replace(',', '.')) || 0;
                        const total = quantita * prezzo;
                        const avzPercent = Math.min(Math.max(parseFloat(row.avanzamentoPercent.replace(',', '.')) || 0, 0), 100);
                        const avzEuro = total * avzPercent / 100;
                        totalsMap.set(row.id, {
                            total,
                            avzEuro,
                            avzPercent,
                            hasChildren: false
                        });
                        return {
                            total,
                            avzEuro
                        };
                    }
                    let total = 0;
                    let avzEuro = 0;
                    for (const child of children){
                        const childTotals = computeTotals(child);
                        total += childTotals.total;
                        avzEuro += childTotals.avzEuro;
                    }
                    const avzPercent = total > 0 ? avzEuro / total * 100 : 0;
                    totalsMap.set(row.id, {
                        total,
                        avzEuro,
                        avzPercent,
                        hasChildren: true
                    });
                    return {
                        total,
                        avzEuro
                    };
                }
            }["useAppaltoVoci.useMemo[appaltoRowsFlat].computeTotals"];
            for (const row of appaltoRows){
                if (!totalsMap.has(row.id)) {
                    computeTotals(row);
                }
            }
            const result = [];
            const visit = {
                "useAppaltoVoci.useMemo[appaltoRowsFlat].visit": (parentId, level, parentCode)=>{
                    const children = byParent.get(parentId);
                    if (!children) return;
                    children.forEach({
                        "useAppaltoVoci.useMemo[appaltoRowsFlat].visit": (child, index)=>{
                            const wbsCode = parentCode ? `${parentCode}.${index + 1}` : `${index + 1}`;
                            const totals = totalsMap.get(child.id) ?? {
                                total: 0,
                                avzEuro: 0,
                                avzPercent: 0,
                                hasChildren: false
                            };
                            const isCollapsed = collapsedAppaltoIds.has(child.id);
                            result.push({
                                ...child,
                                level,
                                wbsCode,
                                total: totals.total,
                                avzEuro: totals.avzEuro,
                                avzPercent: totals.avzPercent,
                                hasChildren: totals.hasChildren,
                                isCollapsed
                            });
                            if (!isCollapsed) {
                                visit(child.id, level + 1, wbsCode);
                            }
                        }
                    }["useAppaltoVoci.useMemo[appaltoRowsFlat].visit"]);
                }
            }["useAppaltoVoci.useMemo[appaltoRowsFlat].visit"];
            visit(null, 0, null);
            return result;
        }
    }["useAppaltoVoci.useMemo[appaltoRowsFlat]"], [
        appaltoRows,
        collapsedAppaltoIds
    ]);
    const handleSaveAppaltoRows = async ()=>{
        if (!selectedCommessaId) return;
        setIsSavingAppalto(true);
        setError(null);
        try {
            const payload = appaltoRows.filter((row)=>row.descrizione.trim() || row.unitaMisura.trim()).map((row)=>({
                    parentId: row.parentId || null,
                    descrizione: row.descrizione,
                    unitaMisura: row.unitaMisura,
                    quantita: parseFloat(row.quantita.replace(',', '.')) || 0,
                    prezzoUnitario: parseFloat(row.prezzoUnitario.replace(',', '.')) || 0,
                    avanzamentoPercent: Math.min(Math.max(parseFloat(row.avanzamentoPercent.replace(',', '.')) || 0, 0), 100)
                }));
            const res = await fetch(`${baseUrl}/api/commesse/${selectedCommessaId}/appalto-voci`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
            if (!res.ok) {
                const errData = await res.json().catch(()=>({}));
                throw new Error(errData.message || 'Errore durante il salvataggio delle voci');
            }
            const saved = await res.json();
            setAppaltoRows(saved.map((row)=>({
                    id: row.id,
                    parentId: row.parentId ?? null,
                    descrizione: row.descrizione || '',
                    unitaMisura: row.unitaMisura || '',
                    quantita: row.quantita?.toString?.() || '',
                    prezzoUnitario: row.prezzoUnitario?.toString?.() || '',
                    avanzamentoPercent: row.avanzamentoPercent?.toString?.() || ''
                })));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Errore durante il salvataggio delle voci');
        } finally{
            setIsSavingAppalto(false);
        }
    };
    return {
        appaltoRows,
        setAppaltoRows,
        isSavingAppalto,
        fetchAppaltoVoci,
        handleAddAppaltoRow,
        handleAddAppaltoChildRow,
        handleUpdateAppaltoRow,
        handleRemoveAppaltoRow,
        toggleAppaltoRow,
        handleSaveAppaltoRows,
        appaltoRowsFlat
    };
}
_s(useAppaltoVoci, "Wtht0rAUM1rFyFaJiAh0RNu8oTU=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/web/app/hooks/useCommesse.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useCommesse",
    ()=>useCommesse
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.2.6_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
const defaultFormData = ()=>({
        codiceIdentificativo: '',
        tipoLavori: '',
        nomeCliente: '',
        dataCreazione: new Date().toISOString().split('T')[0],
        indirizzo: '',
        citta: '',
        cap: '',
        responsabile: ''
    });
const PAGE_SIZE = 20;
function useCommesse(baseUrl, setError) {
    _s();
    const [view, setView] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('dashboard');
    const [activeTab, setActiveTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('sintesi');
    const [commesse, setCommesse] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [selectedCommessa, setSelectedCommessa] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [commessaToDelete, setCommessaToDelete] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [deleteInfo, setDeleteInfo] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [page, setPage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(1);
    const [totalPages, setTotalPages] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(1);
    const [total, setTotal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [formData, setFormData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(defaultFormData());
    const [success, setSuccess] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [submitting, setSubmitting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [pmFolders, setPmFolders] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [pmMode, setPmMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('select');
    const [isClosing, setIsClosing] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isDeleting, setIsDeleting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showCreateModal, setShowCreateModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showCloseModal, setShowCloseModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showDeleteModal, setShowDeleteModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showHomeDeleteModal, setShowHomeDeleteModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Stats aggregate dal server (tutti i record, non solo la pagina corrente)
    const [apiStats, setApiStats] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // Filtri attivi
    const [filters, setFilters] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const fetchCommesse = async (targetPage = page, activeFilters = filters)=>{
        try {
            setLoading(true);
            const params = new URLSearchParams({
                page: String(targetPage),
                limit: String(PAGE_SIZE)
            });
            if (activeFilters.stato) params.set('stato', activeFilters.stato);
            if (activeFilters.responsabile) params.set('responsabile', activeFilters.responsabile);
            if (activeFilters.anno) params.set('anno', activeFilters.anno);
            if (activeFilters.citta) params.set('citta', activeFilters.citta);
            if (activeFilters.search) params.set('search', activeFilters.search);
            const res = await fetch(`${baseUrl}/api/commesse?${params.toString()}`);
            if (!res.ok) throw new Error('Sincronizzazione API fallita');
            const result = await res.json();
            setCommesse(result.data);
            setTotal(result.total);
            setTotalPages(result.totalPages);
            setPage(targetPage);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Errore di connessione al database');
        } finally{
            setLoading(false);
        }
    };
    const applyFilters = (newFilters)=>{
        setFilters(newFilters);
        fetchCommesse(1, newFilters);
    };
    const fetchStats = async ()=>{
        try {
            const res = await fetch(`${baseUrl}/api/commesse/stats`);
            if (!res.ok) return;
            const data = await res.json();
            setApiStats({
                totaleCommesse: data.totaleImporti ?? 0,
                costiCommesse: data.totaleBudget ?? 0,
                avanzamento: (data.avanzamentoMedio ?? 0).toFixed(1)
            });
        } catch  {}
    };
    const fetchDeleteInfo = async (commessaId)=>{
        try {
            const res = await fetch(`${baseUrl}/api/commesse/${commessaId}/delete-info`);
            if (!res.ok) throw new Error('Impossibile verificare i file della commessa');
            const data = await res.json();
            setDeleteInfo(data);
        } catch  {
            setDeleteInfo(null);
        }
    };
    const suggestNextCode = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useCommesse.useMemo[suggestNextCode]": ()=>{
            const year = new Date().getFullYear();
            const count = total + 1;
            const paddedCount = count.toString().padStart(3, '0');
            return `${year}-COMM-${paddedCount}`;
        }
    }["useCommesse.useMemo[suggestNextCode]"], [
        total
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useCommesse.useEffect": ()=>{
            const loadNextCode = {
                "useCommesse.useEffect.loadNextCode": async ()=>{
                    try {
                        const res = await fetch(`${baseUrl}/api/commesse/next-code`);
                        if (!res.ok) throw new Error('Impossibile generare il codice automatico');
                        const data = await res.json();
                        setFormData({
                            "useCommesse.useEffect.loadNextCode": (prev)=>({
                                    ...prev,
                                    codiceIdentificativo: data.codiceIdentificativo
                                })
                        }["useCommesse.useEffect.loadNextCode"]);
                    } catch (err) {
                        setFormData({
                            "useCommesse.useEffect.loadNextCode": (prev)=>({
                                    ...prev,
                                    codiceIdentificativo: suggestNextCode
                                })
                        }["useCommesse.useEffect.loadNextCode"]);
                        setError(err instanceof Error ? err.message : 'Impossibile generare il codice automatico');
                    }
                }
            }["useCommesse.useEffect.loadNextCode"];
            if (showCreateModal && !formData.codiceIdentificativo) {
                loadNextCode();
            }
            if (showCreateModal) {
                fetch(`${baseUrl}/api/documenti/pm-folders`).then({
                    "useCommesse.useEffect": (r)=>r.json()
                }["useCommesse.useEffect"]).then({
                    "useCommesse.useEffect": (data)=>{
                        setPmFolders(data);
                        setPmMode(data.length > 0 ? 'select' : 'free');
                    }
                }["useCommesse.useEffect"]).catch({
                    "useCommesse.useEffect": ()=>{
                        setPmFolders([]);
                        setPmMode('free');
                    }
                }["useCommesse.useEffect"]);
            }
        }
    }["useCommesse.useEffect"], [
        showCreateModal,
        suggestNextCode,
        baseUrl,
        formData.codiceIdentificativo
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useCommesse.useEffect": ()=>{
            fetchCommesse(1);
            fetchStats();
        }
    }["useCommesse.useEffect"], [
        baseUrl
    ]);
    const handleCreateCommessa = async (e)=>{
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = await fetch(`${baseUrl}/api/commesse`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    codiceIdentificativo: formData.codiceIdentificativo,
                    tipoLavori: formData.tipoLavori,
                    nomeCantiere: `${formData.codiceIdentificativo} - ${formData.citta || formData.indirizzo}`,
                    nomeCliente: formData.nomeCliente,
                    dataInizio: formData.dataCreazione,
                    indirizzo: formData.indirizzo,
                    citta: formData.citta,
                    cap: formData.cap,
                    responsabile: formData.responsabile
                })
            });
            if (!res.ok) {
                const errData = await res.json().catch(()=>({}));
                const errorMessage = Array.isArray(errData.message) ? errData.message.join(' | ') : errData.message || 'Errore fatale del server durante la registrazione';
                throw new Error(errorMessage);
            }
            setSuccess(true);
            setTimeout(()=>{
                setSuccess(false);
                handleCloseCreateModal();
                fetchCommesse(1);
                fetchStats();
            }, 1500);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Errore durante la creazione della commessa');
        } finally{
            setSubmitting(false);
        }
    };
    const handleCloseCreateModal = ()=>{
        setShowCreateModal(false);
        setPmMode('select');
        setPmFolders([]);
        setFormData(defaultFormData());
    };
    const handleCloseCommessa = async ()=>{
        if (!selectedCommessa) return;
        setIsClosing(true);
        setError(null);
        try {
            const res = await fetch(`${baseUrl}/api/commesse/${selectedCommessa.id}/chiudi`, {
                method: 'PATCH'
            });
            if (!res.ok) {
                const errData = await res.json().catch(()=>({}));
                throw new Error(errData.message || 'Errore durante la chiusura');
            }
            setShowCloseModal(false);
            setSelectedCommessa(null);
            setView('dashboard');
            fetchCommesse(page);
        } catch (err) {
            setShowCloseModal(false);
            setError(err instanceof Error ? err.message : 'Errore durante la chiusura commessa');
        } finally{
            setIsClosing(false);
        }
    };
    const handleDeleteCommessa = async ()=>{
        if (!selectedCommessa) return;
        setIsDeleting(true);
        setError(null);
        try {
            const res = await fetch(`${baseUrl}/api/commesse/${selectedCommessa.id}`, {
                method: 'DELETE'
            });
            if (!res.ok) {
                const errData = await res.json().catch(()=>({}));
                throw new Error(errData.message || 'Errore durante eliminazione commessa');
            }
            setShowDeleteModal(false);
            setSelectedCommessa(null);
            setView('dashboard');
            fetchCommesse(page);
            fetchStats();
        } catch (err) {
            setShowDeleteModal(false);
            setError(err instanceof Error ? err.message : 'Errore durante eliminazione commessa');
        } finally{
            setIsDeleting(false);
        }
    };
    const handleDeleteFromHome = async ()=>{
        if (!commessaToDelete) return;
        setIsDeleting(true);
        setError(null);
        try {
            const res = await fetch(`${baseUrl}/api/commesse/${commessaToDelete.id}/home`, {
                method: 'DELETE'
            });
            if (!res.ok) {
                const errData = await res.json().catch(()=>({}));
                throw new Error(errData.message || 'Eliminazione non consentita dalla dashboard');
            }
            setShowHomeDeleteModal(false);
            setCommessaToDelete(null);
            fetchCommesse(page);
            fetchStats();
        } catch (err) {
            setShowHomeDeleteModal(false);
            setError(err instanceof Error ? err.message : 'Errore durante eliminazione dalla dashboard');
        } finally{
            setIsDeleting(false);
        }
    };
    const handleUpdateDataInizioLavori = async (date)=>{
        if (!selectedCommessa) return;
        try {
            await fetch(`${baseUrl}/commesse/${selectedCommessa.id}/data-inizio-lavori`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    dataInizioLavori: date
                })
            });
            setSelectedCommessa({
                ...selectedCommessa,
                dataInizioLavori: date
            });
            fetchCommesse(page);
        } catch  {
        // silent
        }
    };
    // Fallback stats calcolate dalla pagina corrente se l'API non ha ancora risposto
    const localStats = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useCommesse.useMemo[localStats]": ()=>{
            const totaleCommesse = commesse.reduce({
                "useCommesse.useMemo[localStats].totaleCommesse": (acc, c)=>acc + Number(c.importoCalcolato || 0)
            }["useCommesse.useMemo[localStats].totaleCommesse"], 0);
            const costiCommesse = commesse.reduce({
                "useCommesse.useMemo[localStats].costiCommesse": (acc, c)=>{
                    const costi = c.fatture?.reduce({
                        "useCommesse.useMemo[localStats].costiCommesse": (sum, f)=>sum + Number(f.importoImponibile || 0)
                    }["useCommesse.useMemo[localStats].costiCommesse"], 0) || 0;
                    return acc + costi;
                }
            }["useCommesse.useMemo[localStats].costiCommesse"], 0);
            const avanzamento = commesse.length > 0 ? commesse.reduce({
                "useCommesse.useMemo[localStats]": (acc, c)=>acc + (c.sals?.[0]?.percentualeCompletamento || 0)
            }["useCommesse.useMemo[localStats]"], 0) / commesse.length : 0;
            return {
                totaleCommesse,
                costiCommesse,
                avanzamento: avanzamento.toFixed(1)
            };
        }
    }["useCommesse.useMemo[localStats]"], [
        commesse
    ]);
    const stats = apiStats ?? localStats;
    return {
        view,
        setView,
        activeTab,
        setActiveTab,
        commesse,
        selectedCommessa,
        setSelectedCommessa,
        commessaToDelete,
        setCommessaToDelete,
        loading,
        setLoading,
        deleteInfo,
        setDeleteInfo,
        formData,
        setFormData,
        success,
        submitting,
        pmFolders,
        setPmFolders,
        pmMode,
        setPmMode,
        isClosing,
        isDeleting,
        showCreateModal,
        setShowCreateModal,
        showCloseModal,
        setShowCloseModal,
        showDeleteModal,
        setShowDeleteModal,
        showHomeDeleteModal,
        setShowHomeDeleteModal,
        fetchCommesse,
        fetchDeleteInfo,
        handleCreateCommessa,
        handleCloseCreateModal,
        handleCloseCommessa,
        handleDeleteCommessa,
        handleDeleteFromHome,
        handleUpdateDataInizioLavori,
        stats,
        page,
        totalPages,
        total,
        filters,
        applyFilters
    };
}
_s(useCommesse, "kjqgnOZ47XwIXCFc/rKjaqqD0vw=");
const defaultFormData = ()=>({
        codiceIdentificativo: '',
        tipoLavori: '',
        nomeCliente: '',
        dataCreazione: new Date().toISOString().split('T')[0],
        indirizzo: '',
        citta: '',
        cap: '',
        responsabile: ''
    });
function useCommesse(baseUrl, setError) {
    _s1();
    const [view, setView] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('dashboard');
    const [activeTab, setActiveTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('sintesi');
    const [commesse, setCommesse] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [selectedCommessa, setSelectedCommessa] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [commessaToDelete, setCommessaToDelete] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [deleteInfo, setDeleteInfo] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [formData, setFormData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(defaultFormData());
    const [success, setSuccess] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [submitting, setSubmitting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [pmFolders, setPmFolders] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [pmMode, setPmMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('select');
    const [isClosing, setIsClosing] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isDeleting, setIsDeleting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showCreateModal, setShowCreateModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showCloseModal, setShowCloseModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showDeleteModal, setShowDeleteModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showHomeDeleteModal, setShowHomeDeleteModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const fetchCommesse = async ()=>{
        try {
            setLoading(true);
            const res = await fetch(`${baseUrl}/api/commesse`);
            if (!res.ok) throw new Error('Sincronizzazione API fallita');
            const data = await res.json();
            setCommesse(data);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Errore di connessione al database');
        } finally{
            setLoading(false);
        }
    };
    const fetchDeleteInfo = async (commessaId)=>{
        try {
            const res = await fetch(`${baseUrl}/api/commesse/${commessaId}/delete-info`);
            if (!res.ok) throw new Error('Impossibile verificare i file della commessa');
            const data = await res.json();
            setDeleteInfo(data);
        } catch  {
            setDeleteInfo(null);
        }
    };
    const suggestNextCode = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useCommesse.useMemo[suggestNextCode]": ()=>{
            const year = new Date().getFullYear();
            const count = commesse.length + 1;
            const paddedCount = count.toString().padStart(3, '0');
            return `${year}-COMM-${paddedCount}`;
        }
    }["useCommesse.useMemo[suggestNextCode]"], [
        commesse
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useCommesse.useEffect": ()=>{
            const loadNextCode = {
                "useCommesse.useEffect.loadNextCode": async ()=>{
                    try {
                        const res = await fetch(`${baseUrl}/api/commesse/next-code`);
                        if (!res.ok) throw new Error('Impossibile generare il codice automatico');
                        const data = await res.json();
                        setFormData({
                            "useCommesse.useEffect.loadNextCode": (prev)=>({
                                    ...prev,
                                    codiceIdentificativo: data.codiceIdentificativo
                                })
                        }["useCommesse.useEffect.loadNextCode"]);
                    } catch (err) {
                        setFormData({
                            "useCommesse.useEffect.loadNextCode": (prev)=>({
                                    ...prev,
                                    codiceIdentificativo: suggestNextCode
                                })
                        }["useCommesse.useEffect.loadNextCode"]);
                        setError(err instanceof Error ? err.message : 'Impossibile generare il codice automatico');
                    }
                }
            }["useCommesse.useEffect.loadNextCode"];
            if (showCreateModal && !formData.codiceIdentificativo) {
                loadNextCode();
            }
            if (showCreateModal) {
                fetch(`${baseUrl}/api/documenti/pm-folders`).then({
                    "useCommesse.useEffect": (r)=>r.json()
                }["useCommesse.useEffect"]).then({
                    "useCommesse.useEffect": (data)=>{
                        setPmFolders(data);
                        setPmMode(data.length > 0 ? 'select' : 'free');
                    }
                }["useCommesse.useEffect"]).catch({
                    "useCommesse.useEffect": ()=>{
                        setPmFolders([]);
                        setPmMode('free');
                    }
                }["useCommesse.useEffect"]);
            }
        }
    }["useCommesse.useEffect"], [
        showCreateModal,
        suggestNextCode,
        baseUrl,
        formData.codiceIdentificativo
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useCommesse.useEffect": ()=>{
            fetchCommesse();
        }
    }["useCommesse.useEffect"], [
        baseUrl
    ]);
    const handleCreateCommessa = async (e)=>{
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = await fetch(`${baseUrl}/api/commesse`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    codiceIdentificativo: formData.codiceIdentificativo,
                    tipoLavori: formData.tipoLavori,
                    nomeCantiere: `${formData.codiceIdentificativo} - ${formData.citta || formData.indirizzo}`,
                    nomeCliente: formData.nomeCliente,
                    dataInizio: formData.dataCreazione,
                    indirizzo: formData.indirizzo,
                    citta: formData.citta,
                    cap: formData.cap,
                    responsabile: formData.responsabile
                })
            });
            if (!res.ok) {
                const errData = await res.json().catch(()=>({}));
                const errorMessage = Array.isArray(errData.message) ? errData.message.join(' | ') : errData.message || 'Errore fatale del server durante la registrazione';
                throw new Error(errorMessage);
            }
            setSuccess(true);
            setTimeout(()=>{
                setSuccess(false);
                handleCloseCreateModal();
                fetchCommesse();
            }, 1500);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Errore durante la creazione della commessa');
        } finally{
            setSubmitting(false);
        }
    };
    const handleCloseCreateModal = ()=>{
        setShowCreateModal(false);
        setPmMode('select');
        setPmFolders([]);
        setFormData(defaultFormData());
    };
    const handleCloseCommessa = async ()=>{
        if (!selectedCommessa) return;
        setIsClosing(true);
        setError(null);
        try {
            const res = await fetch(`${baseUrl}/api/commesse/${selectedCommessa.id}/chiudi`, {
                method: 'PATCH'
            });
            if (!res.ok) {
                const errData = await res.json().catch(()=>({}));
                throw new Error(errData.message || 'Errore durante la chiusura');
            }
            setShowCloseModal(false);
            setSelectedCommessa(null);
            setView('dashboard');
            fetchCommesse();
        } catch (err) {
            setShowCloseModal(false);
            setError(err instanceof Error ? err.message : 'Errore durante la chiusura commessa');
        } finally{
            setIsClosing(false);
        }
    };
    const handleDeleteCommessa = async ()=>{
        if (!selectedCommessa) return;
        setIsDeleting(true);
        setError(null);
        try {
            const res = await fetch(`${baseUrl}/api/commesse/${selectedCommessa.id}`, {
                method: 'DELETE'
            });
            if (!res.ok) {
                const errData = await res.json().catch(()=>({}));
                throw new Error(errData.message || 'Errore durante eliminazione commessa');
            }
            setShowDeleteModal(false);
            setSelectedCommessa(null);
            setView('dashboard');
            fetchCommesse();
        } catch (err) {
            setShowDeleteModal(false);
            setError(err instanceof Error ? err.message : 'Errore durante eliminazione commessa');
        } finally{
            setIsDeleting(false);
        }
    };
    const handleDeleteFromHome = async ()=>{
        if (!commessaToDelete) return;
        setIsDeleting(true);
        setError(null);
        try {
            const res = await fetch(`${baseUrl}/api/commesse/${commessaToDelete.id}/home`, {
                method: 'DELETE'
            });
            if (!res.ok) {
                const errData = await res.json().catch(()=>({}));
                throw new Error(errData.message || 'Eliminazione non consentita dalla dashboard');
            }
            setShowHomeDeleteModal(false);
            setCommessaToDelete(null);
            fetchCommesse();
        } catch (err) {
            setShowHomeDeleteModal(false);
            setError(err instanceof Error ? err.message : 'Errore durante eliminazione dalla dashboard');
        } finally{
            setIsDeleting(false);
        }
    };
    const handleUpdateDataInizioLavori = async (date)=>{
        if (!selectedCommessa) return;
        try {
            await fetch(`${baseUrl}/commesse/${selectedCommessa.id}/data-inizio-lavori`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    dataInizioLavori: date
                })
            });
            setSelectedCommessa({
                ...selectedCommessa,
                dataInizioLavori: date
            });
            fetchCommesse();
        } catch  {
        // silent
        }
    };
    const stats = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useCommesse.useMemo[stats]": ()=>{
            const totaleCommesse = commesse.reduce({
                "useCommesse.useMemo[stats].totaleCommesse": (acc, c)=>acc + Number(c.importoCalcolato || 0)
            }["useCommesse.useMemo[stats].totaleCommesse"], 0);
            const costiCommesse = commesse.reduce({
                "useCommesse.useMemo[stats].costiCommesse": (acc, c)=>{
                    const costi = c.fatture?.reduce({
                        "useCommesse.useMemo[stats].costiCommesse": (sum, f)=>sum + Number(f.importoImponibile || 0)
                    }["useCommesse.useMemo[stats].costiCommesse"], 0) || 0;
                    return acc + costi;
                }
            }["useCommesse.useMemo[stats].costiCommesse"], 0);
            const avanzamento = commesse.length > 0 ? commesse.reduce({
                "useCommesse.useMemo[stats]": (acc, c)=>acc + (c.sals?.[0]?.percentualeCompletamento || 0)
            }["useCommesse.useMemo[stats]"], 0) / commesse.length : 0;
            return {
                totaleCommesse,
                costiCommesse,
                avanzamento: avanzamento.toFixed(1)
            };
        }
    }["useCommesse.useMemo[stats]"], [
        commesse
    ]);
    return {
        view,
        setView,
        activeTab,
        setActiveTab,
        commesse,
        selectedCommessa,
        setSelectedCommessa,
        commessaToDelete,
        setCommessaToDelete,
        loading,
        setLoading,
        deleteInfo,
        setDeleteInfo,
        formData,
        setFormData,
        success,
        submitting,
        pmFolders,
        setPmFolders,
        pmMode,
        setPmMode,
        isClosing,
        isDeleting,
        showCreateModal,
        setShowCreateModal,
        showCloseModal,
        setShowCloseModal,
        showDeleteModal,
        setShowDeleteModal,
        showHomeDeleteModal,
        setShowHomeDeleteModal,
        fetchCommesse,
        fetchDeleteInfo,
        handleCreateCommessa,
        handleCloseCreateModal,
        handleCloseCommessa,
        handleDeleteCommessa,
        handleDeleteFromHome,
        handleUpdateDataInizioLavori,
        stats
    };
}
_s1(useCommesse, "bjkY7/0vJdP+vApLShP6DFOyZc8=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/web/app/hooks/useDocumenti.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useDocumenti",
    ()=>useDocumenti
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.2.6_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
'use client';
;
const emptyVoce = ()=>({
        fornitore: '',
        descrizione: '',
        um: '',
        qty: '',
        prezzoUnit: ''
    });
function useDocumenti(baseUrl, selectedCommessa, setError) {
    _s();
    const [documenti, setDocumenti] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [isUploading, setIsUploading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Preview
    const [previewDoc, setPreviewDoc] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // Modal: Contratto Cliente
    const [showContrattoClienteModal, setShowContrattoClienteModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [contrattoClienteForm, setContrattoClienteForm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        nomeCliente: '',
        dataContratto: new Date().toISOString().split('T')[0],
        importoContratto: '',
        note: ''
    });
    const [contrattoClienteFiles, setContrattoClienteFiles] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [isSavingContrattoCliente, setIsSavingContrattoCliente] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Modal: Variante
    const [showVarianteModal, setShowVarianteModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [varianteForm, setVarianteForm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        nomeCliente: '',
        dataVariante: new Date().toISOString().split('T')[0],
        voci: [
            emptyVoce()
        ]
    });
    const [varianteBaseContratti, setVarianteBaseContratti] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [editingVarianteId, setEditingVarianteId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [varianteFiles, setVarianteFiles] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [isSavingVariante, setIsSavingVariante] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Modal: Contratto Fornitore
    const [showContrattoFornitoreModal, setShowContrattoFornitoreModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [contrattoFornitoreForm, setContrattoFornitoreForm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        ragioneSociale: '',
        partitaIva: '',
        attivita: '',
        tipo: 'Fornitore di Materiale',
        referente: '',
        telefono: '',
        isNuovoFornitore: true
    });
    const [contrattoFornitoreFiles, setContrattoFornitoreFiles] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [isSavingContrattoFornitore, setIsSavingContrattoFornitore] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Modal: Doc Progettuale
    const [showDocProgettualeModal, setShowDocProgettualeModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [docProgettualeForm, setDocProgettualeForm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        nome: '',
        descrizione: '',
        note: ''
    });
    const [docProgettualeFiles, setDocProgettualeFiles] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [isSavingDocProgettuale, setIsSavingDocProgettuale] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Modal: Fornitore Doc
    const [showFornitoreDocModal, setShowFornitoreDocModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [selectedFornitore, setSelectedFornitore] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [fornitoreDocForm, setFornitoreDocForm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        tipoDocumento: '',
        importo: '',
        tempiPagamento: '',
        note: ''
    });
    const [fornitoreDocFiles, setFornitoreDocFiles] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [isSavingFornitoreDoc, setIsSavingFornitoreDoc] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // ─── Fetches ─────────────────────────────────────────────────────────────
    const fetchDocumenti = async (commessaId)=>{
        try {
            const res = await fetch(`${baseUrl}/api/documenti/COMMESSA/${commessaId}`);
            if (!res.ok) throw new Error('Impossibile recuperare i documenti');
            const data = await res.json();
            setDocumenti(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Impossibile recuperare i documenti');
        }
    };
    // ─── Handlers ────────────────────────────────────────────────────────────
    const handleDeleteVariante = async (documentoId)=>{
        if (!confirm('Eliminare definitivamente questa variante?')) return;
        try {
            const res = await fetch(`${baseUrl}/api/documenti/${documentoId}`, {
                method: 'DELETE'
            });
            if (!res.ok && res.status !== 204) throw new Error("Errore durante l'eliminazione");
            if (selectedCommessa) await fetchDocumenti(selectedCommessa.id);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Errore durante l'eliminazione della variante");
        }
    };
    const handleUpdateDocStato = async (docId, currentMeta, nuovoStato)=>{
        const updatedMeta = JSON.stringify({
            ...currentMeta,
            stato: nuovoStato
        });
        try {
            const res = await fetch(`${baseUrl}/api/documenti/${docId}/metadata`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    datiEstrattiJson: updatedMeta
                })
            });
            if (!res.ok) throw new Error('Errore aggiornamento stato');
            if (selectedCommessa) await fetchDocumenti(selectedCommessa.id);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Errore aggiornamento stato');
        }
    };
    const handleContrattoClienteUpload = async (e)=>{
        e.preventDefault();
        if (!selectedCommessa || contrattoClienteFiles.length === 0) {
            setError('Aggiungi almeno un documento da allegare.');
            return;
        }
        setIsSavingContrattoCliente(true);
        setError(null);
        const metadata = JSON.stringify({
            nomeCliente: contrattoClienteForm.nomeCliente,
            dataContratto: contrattoClienteForm.dataContratto,
            importoContratto: contrattoClienteForm.importoContratto,
            note: contrattoClienteForm.note
        });
        try {
            for (const file of contrattoClienteFiles){
                const payload = new FormData();
                payload.append('file', file);
                payload.append('entitaTipo', 'COMMESSA');
                payload.append('entitaId', selectedCommessa.id);
                payload.append('categoria', 'Contratti Cliente');
                payload.append('sottocategoria', contrattoClienteForm.nomeCliente);
                payload.append('datiEstrattiJson', metadata);
                const res = await fetch(`${baseUrl}/api/documenti/upload`, {
                    method: 'POST',
                    body: payload
                });
                if (!res.ok) {
                    const errData = await res.json().catch(()=>({}));
                    throw new Error(Array.isArray(errData.message) ? errData.message.join(' | ') : errData.message || 'Errore durante il caricamento');
                }
            }
            setShowContrattoClienteModal(false);
            setContrattoClienteForm({
                nomeCliente: '',
                dataContratto: new Date().toISOString().split('T')[0],
                importoContratto: '',
                note: ''
            });
            setContrattoClienteFiles([]);
            await fetchDocumenti(selectedCommessa.id);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Errore durante il caricamento del contratto cliente');
        } finally{
            setIsSavingContrattoCliente(false);
        }
    };
    const handleVarianteUpload = async (e)=>{
        e.preventDefault();
        if (!selectedCommessa || !editingVarianteId && varianteFiles.length === 0) {
            setError('Aggiungi almeno un documento da allegare.');
            return;
        }
        setIsSavingVariante(true);
        setError(null);
        const totaleVariante = varianteForm.voci.reduce((acc, v)=>{
            const qty = parseFloat(v.qty) || 0;
            const pu = parseFloat(v.prezzoUnit) || 0;
            return acc + qty * pu;
        }, 0);
        const metadata = JSON.stringify({
            tipoDocumento: 'Variante',
            nomeCliente: varianteForm.nomeCliente,
            dataVariante: varianteForm.dataVariante,
            importoVariante: Math.abs(totaleVariante),
            segno: totaleVariante >= 0 ? '+' : '-',
            voci: varianteForm.voci,
            descrizione: varianteForm.voci.map((v)=>v.descrizione).filter(Boolean).join(', ')
        });
        try {
            if (editingVarianteId) {
                const res = await fetch(`${baseUrl}/api/documenti/${editingVarianteId}/metadata`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        datiEstrattiJson: metadata
                    })
                });
                if (!res.ok) {
                    const errData = await res.json().catch(()=>({}));
                    throw new Error(Array.isArray(errData.message) ? errData.message.join(' | ') : errData.message || 'Errore durante il salvataggio');
                }
            } else {
                for (const file of varianteFiles){
                    const payload = new FormData();
                    payload.append('file', file);
                    payload.append('entitaTipo', 'COMMESSA');
                    payload.append('entitaId', selectedCommessa.id);
                    payload.append('categoria', 'Contratti Cliente');
                    payload.append('sottocategoria', 'Variante');
                    payload.append('datiEstrattiJson', metadata);
                    const res = await fetch(`${baseUrl}/api/documenti/upload`, {
                        method: 'POST',
                        body: payload
                    });
                    if (!res.ok) {
                        const errData = await res.json().catch(()=>({}));
                        throw new Error(Array.isArray(errData.message) ? errData.message.join(' | ') : errData.message || 'Errore durante il caricamento');
                    }
                }
            }
            setShowVarianteModal(false);
            setEditingVarianteId(null);
            setVarianteForm({
                nomeCliente: '',
                dataVariante: new Date().toISOString().split('T')[0],
                voci: [
                    emptyVoce()
                ]
            });
            setVarianteFiles([]);
            await fetchDocumenti(selectedCommessa.id);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Errore durante il caricamento della variante');
        } finally{
            setIsSavingVariante(false);
        }
    };
    const handleContrattoFornitoreUpload = async (e)=>{
        e.preventDefault();
        if (!selectedCommessa || contrattoFornitoreFiles.length === 0) {
            setError('Aggiungi almeno un documento da allegare.');
            return;
        }
        if (!contrattoFornitoreForm.ragioneSociale.trim()) {
            setError('La ragione sociale del fornitore è obbligatoria.');
            return;
        }
        setIsSavingContrattoFornitore(true);
        setError(null);
        const metadata = JSON.stringify({
            ragioneSociale: contrattoFornitoreForm.ragioneSociale,
            partitaIva: contrattoFornitoreForm.partitaIva,
            attivita: contrattoFornitoreForm.attivita,
            tipo: contrattoFornitoreForm.tipo,
            referente: contrattoFornitoreForm.referente,
            telefono: contrattoFornitoreForm.telefono
        });
        try {
            for (const file of contrattoFornitoreFiles){
                const payload = new FormData();
                payload.append('file', file);
                payload.append('entitaTipo', 'COMMESSA');
                payload.append('entitaId', selectedCommessa.id);
                payload.append('categoria', 'Contratti Fornitori');
                payload.append('sottocategoria', contrattoFornitoreForm.ragioneSociale);
                payload.append('datiEstrattiJson', metadata);
                const res = await fetch(`${baseUrl}/api/documenti/upload`, {
                    method: 'POST',
                    body: payload
                });
                if (!res.ok) {
                    const errData = await res.json().catch(()=>({}));
                    throw new Error(Array.isArray(errData.message) ? errData.message.join(' | ') : errData.message || 'Errore durante il caricamento');
                }
            }
            setShowContrattoFornitoreModal(false);
            setContrattoFornitoreForm({
                ragioneSociale: '',
                partitaIva: '',
                attivita: '',
                tipo: 'Fornitore di Materiale',
                referente: '',
                telefono: '',
                isNuovoFornitore: true
            });
            setContrattoFornitoreFiles([]);
            await fetchDocumenti(selectedCommessa.id);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Errore durante il caricamento del contratto fornitore');
        } finally{
            setIsSavingContrattoFornitore(false);
        }
    };
    const handleDocProgettualeUpload = async (e)=>{
        e.preventDefault();
        if (!selectedCommessa || docProgettualeFiles.length === 0) {
            setError('Aggiungi almeno un documento da allegare.');
            return;
        }
        setIsSavingDocProgettuale(true);
        setError(null);
        const metadata = JSON.stringify({
            nome: docProgettualeForm.nome,
            descrizione: docProgettualeForm.descrizione,
            note: docProgettualeForm.note
        });
        try {
            for (const file of docProgettualeFiles){
                const payload = new FormData();
                payload.append('file', file);
                payload.append('entitaTipo', 'COMMESSA');
                payload.append('entitaId', selectedCommessa.id);
                payload.append('categoria', 'Documentazione Progettuale');
                payload.append('datiEstrattiJson', metadata);
                const res = await fetch(`${baseUrl}/api/documenti/upload`, {
                    method: 'POST',
                    body: payload
                });
                if (!res.ok) {
                    const errData = await res.json().catch(()=>({}));
                    throw new Error(Array.isArray(errData.message) ? errData.message.join(' | ') : errData.message || 'Errore durante il caricamento');
                }
            }
            setShowDocProgettualeModal(false);
            setDocProgettualeForm({
                nome: '',
                descrizione: '',
                note: ''
            });
            setDocProgettualeFiles([]);
            await fetchDocumenti(selectedCommessa.id);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Errore durante il caricamento del documento progettuale');
        } finally{
            setIsSavingDocProgettuale(false);
        }
    };
    const handleFornitoreDocUpload = async (e)=>{
        e.preventDefault();
        if (!selectedCommessa || !selectedFornitore || fornitoreDocFiles.length === 0) {
            setError('Aggiungi almeno un file da allegare.');
            return;
        }
        setIsSavingFornitoreDoc(true);
        setError(null);
        const isServizio = selectedFornitore.tipo === 'Fornitore di Servizi/Subappaltatore';
        const categoriaUpload = isServizio ? 'Documenti Fornitore Servizi' : 'Documenti Fornitore Materiali';
        const metadata = JSON.stringify({
            ragioneSociale: selectedFornitore.ragioneSociale,
            tipoDocumento: fornitoreDocForm.tipoDocumento,
            importo: fornitoreDocForm.importo,
            tempiPagamento: fornitoreDocForm.tempiPagamento,
            note: fornitoreDocForm.note
        });
        try {
            for (const file of fornitoreDocFiles){
                const payload = new FormData();
                payload.append('file', file);
                payload.append('entitaTipo', 'COMMESSA');
                payload.append('entitaId', selectedCommessa.id);
                payload.append('categoria', categoriaUpload);
                payload.append('sottocategoria', selectedFornitore.ragioneSociale);
                payload.append('datiEstrattiJson', metadata);
                const res = await fetch(`${baseUrl}/api/documenti/upload`, {
                    method: 'POST',
                    body: payload
                });
                if (!res.ok) {
                    const errData = await res.json().catch(()=>({}));
                    throw new Error(Array.isArray(errData.message) ? errData.message.join(' | ') : errData.message || 'Errore durante il caricamento');
                }
            }
            setShowFornitoreDocModal(false);
            setFornitoreDocForm({
                tipoDocumento: '',
                importo: '',
                tempiPagamento: '',
                note: ''
            });
            setFornitoreDocFiles([]);
            setSelectedFornitore(null);
            await fetchDocumenti(selectedCommessa.id);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Errore durante il caricamento del documento fornitore');
        } finally{
            setIsSavingFornitoreDoc(false);
        }
    };
    const handleFileUpload = async (file, categoria)=>{
        if (!selectedCommessa) return;
        setIsUploading(true);
        const payload = new FormData();
        payload.append('file', file);
        payload.append('entitaTipo', 'COMMESSA');
        payload.append('entitaId', selectedCommessa.id);
        payload.append('categoria', categoria);
        try {
            const res = await fetch(`${baseUrl}/api/documenti/upload`, {
                method: 'POST',
                body: payload
            });
            if (!res.ok) {
                const errData = await res.json().catch(()=>({}));
                throw new Error(errData.message || 'Errore durante il caricamento del file');
            }
            await fetchDocumenti(selectedCommessa.id);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Errore durante il caricamento del file');
        } finally{
            setIsUploading(false);
        }
    };
    // ─── Modal helpers ────────────────────────────────────────────────────────
    const openVarianteForNew = (baseContratti)=>{
        setVarianteBaseContratti(baseContratti);
        setVarianteForm((f)=>({
                ...f,
                nomeCliente: baseContratti.length === 1 ? baseContratti[0].nomeCliente : '',
                voci: [
                    emptyVoce()
                ]
            }));
        setEditingVarianteId(null);
        setVarianteFiles([]);
        setShowVarianteModal(true);
    };
    const openVarianteForEdit = (varianteId, vm, baseContratti)=>{
        setVarianteBaseContratti(baseContratti);
        setVarianteForm({
            nomeCliente: vm.nomeCliente || '',
            dataVariante: vm.dataVariante || new Date().toISOString().split('T')[0],
            voci: (vm.voci ?? []).length > 0 ? vm.voci : [
                emptyVoce()
            ]
        });
        setEditingVarianteId(varianteId);
        setVarianteFiles([]);
        setShowVarianteModal(true);
    };
    const openContrattoFornitore = (fornitoriEsistenti)=>{
        setContrattoFornitoreForm({
            ragioneSociale: '',
            partitaIva: '',
            attivita: '',
            tipo: 'Fornitore di Materiale',
            referente: '',
            telefono: '',
            isNuovoFornitore: fornitoriEsistenti.length === 0
        });
        setShowContrattoFornitoreModal(true);
    };
    const openFornitoreDoc = (fornitore)=>{
        setSelectedFornitore(fornitore);
        setFornitoreDocForm({
            tipoDocumento: 'Preventivo',
            importo: '',
            tempiPagamento: '',
            note: ''
        });
        setFornitoreDocFiles([]);
        setShowFornitoreDocModal(true);
    };
    // ─── Derived state ────────────────────────────────────────────────────────
    const fornitoriEsistenti = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useDocumenti.useMemo[fornitoriEsistenti]": ()=>{
            const found = new Set();
            for (const doc of documenti){
                if (doc.categoria === 'Contratti Fornitori' && doc.datiEstrattiJson?.ragioneSociale) {
                    found.add(doc.datiEstrattiJson.ragioneSociale);
                }
            }
            return Array.from(found).sort();
        }
    }["useDocumenti.useMemo[fornitoriEsistenti]"], [
        documenti
    ]);
    const fornitoriDaDocumenti = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useDocumenti.useMemo[fornitoriDaDocumenti]": ()=>{
            const map = new Map();
            for (const doc of documenti){
                if (doc.categoria === 'Contratti Fornitori' && doc.datiEstrattiJson?.ragioneSociale) {
                    const rs = doc.datiEstrattiJson.ragioneSociale;
                    if (!map.has(rs)) {
                        map.set(rs, {
                            ragioneSociale: rs,
                            tipo: doc.datiEstrattiJson.tipo || 'Fornitore di Materiale',
                            partitaIva: doc.datiEstrattiJson.partitaIva,
                            referente: doc.datiEstrattiJson.referente,
                            telefono: doc.datiEstrattiJson.telefono,
                            attivita: doc.datiEstrattiJson.attivita
                        });
                    }
                }
            }
            return Array.from(map.values()).sort({
                "useDocumenti.useMemo[fornitoriDaDocumenti]": (a, b)=>a.ragioneSociale.localeCompare(b.ragioneSociale)
            }["useDocumenti.useMemo[fornitoriDaDocumenti]"]);
        }
    }["useDocumenti.useMemo[fornitoriDaDocumenti]"], [
        documenti
    ]);
    const docOperativiPerFornitore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useDocumenti.useMemo[docOperativiPerFornitore]": ()=>{
            const map = new Map();
            for (const doc of documenti){
                if ((doc.categoria === 'Documenti Fornitore Materiali' || doc.categoria === 'Documenti Fornitore Servizi') && doc.datiEstrattiJson?.ragioneSociale) {
                    const rs = doc.datiEstrattiJson.ragioneSociale;
                    const list = map.get(rs) ?? [];
                    list.push(doc);
                    map.set(rs, list);
                }
            }
            return map;
        }
    }["useDocumenti.useMemo[docOperativiPerFornitore]"], [
        documenti
    ]);
    const handleAllegatiClienteUpload = async (files, nomeCliente, descrizione)=>{
        if (!selectedCommessa || files.length === 0) return;
        setIsUploading(true);
        setError(null);
        try {
            for (const file of Array.from(files)){
                const payload = new FormData();
                payload.append('file', file);
                payload.append('entitaTipo', 'COMMESSA');
                payload.append('entitaId', selectedCommessa.id);
                payload.append('categoria', 'Contratti Cliente');
                payload.append('sottocategoria', nomeCliente);
                payload.append('datiEstrattiJson', JSON.stringify({
                    tipoDocumento: 'Allegato',
                    nomeCliente,
                    ...descrizione ? {
                        descrizione
                    } : {}
                }));
                const res = await fetch(`${baseUrl}/api/documenti/upload`, {
                    method: 'POST',
                    body: payload
                });
                if (!res.ok) {
                    const errData = await res.json().catch(()=>({}));
                    throw new Error(errData.message || 'Errore durante il caricamento');
                }
            }
            await fetchDocumenti(selectedCommessa.id);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Errore durante il caricamento degli allegati');
        } finally{
            setIsUploading(false);
        }
    };
    const handleAllegatiFornitoreUpload = async (files, ragioneSociale, descrizione)=>{
        if (!selectedCommessa || files.length === 0) return;
        setIsUploading(true);
        setError(null);
        try {
            for (const file of Array.from(files)){
                const payload = new FormData();
                payload.append('file', file);
                payload.append('entitaTipo', 'COMMESSA');
                payload.append('entitaId', selectedCommessa.id);
                payload.append('categoria', 'Contratti Fornitori');
                payload.append('sottocategoria', ragioneSociale);
                payload.append('datiEstrattiJson', JSON.stringify({
                    tipoDocumento: 'Allegato',
                    ragioneSociale,
                    ...descrizione ? {
                        descrizione
                    } : {}
                }));
                const res = await fetch(`${baseUrl}/api/documenti/upload`, {
                    method: 'POST',
                    body: payload
                });
                if (!res.ok) {
                    const errData = await res.json().catch(()=>({}));
                    throw new Error(errData.message || 'Errore durante il caricamento');
                }
            }
            await fetchDocumenti(selectedCommessa.id);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Errore durante il caricamento degli allegati');
        } finally{
            setIsUploading(false);
        }
    };
    return {
        // state
        documenti,
        isUploading,
        previewDoc,
        setPreviewDoc,
        // contratto cliente
        showContrattoClienteModal,
        setShowContrattoClienteModal,
        contrattoClienteForm,
        setContrattoClienteForm,
        contrattoClienteFiles,
        setContrattoClienteFiles,
        isSavingContrattoCliente,
        // variante
        showVarianteModal,
        setShowVarianteModal,
        varianteForm,
        setVarianteForm,
        varianteBaseContratti,
        setVarianteBaseContratti,
        editingVarianteId,
        setEditingVarianteId,
        varianteFiles,
        setVarianteFiles,
        isSavingVariante,
        // contratto fornitore
        showContrattoFornitoreModal,
        setShowContrattoFornitoreModal,
        contrattoFornitoreForm,
        setContrattoFornitoreForm,
        contrattoFornitoreFiles,
        setContrattoFornitoreFiles,
        isSavingContrattoFornitore,
        // doc progettuale
        showDocProgettualeModal,
        setShowDocProgettualeModal,
        docProgettualeForm,
        setDocProgettualeForm,
        docProgettualeFiles,
        setDocProgettualeFiles,
        isSavingDocProgettuale,
        // fornitore doc
        showFornitoreDocModal,
        setShowFornitoreDocModal,
        selectedFornitore,
        setSelectedFornitore,
        fornitoreDocForm,
        setFornitoreDocForm,
        fornitoreDocFiles,
        setFornitoreDocFiles,
        isSavingFornitoreDoc,
        // handlers
        fetchDocumenti,
        handleDeleteVariante,
        handleUpdateDocStato,
        handleContrattoClienteUpload,
        handleVarianteUpload,
        handleContrattoFornitoreUpload,
        handleDocProgettualeUpload,
        handleFornitoreDocUpload,
        handleFileUpload,
        handleAllegatiClienteUpload,
        handleAllegatiFornitoreUpload,
        // helpers
        openVarianteForNew,
        openVarianteForEdit,
        openContrattoFornitore,
        openFornitoreDoc,
        // derived
        fornitoriEsistenti,
        fornitoriDaDocumenti,
        docOperativiPerFornitore
    };
}
_s(useDocumenti, "7Kid3DGCtC1gH/6ISolPRXVf59c=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/web/app/hooks/useForniture.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useForniture",
    ()=>useForniture
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.2.6_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
'use client';
;
function useForniture(baseUrl, selectedCommessa, setError) {
    _s();
    const [fornitureMateriali, setFornitureMateriali] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [fornitureServizi, setFornitureServizi] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [showMaterialModal, setShowMaterialModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [materialForm, setMaterialForm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        fornitoreNome: '',
        importoFornitura: '',
        descrizione: '',
        preventivoRiferimento: '',
        dataPreventivo: new Date().toISOString().split('T')[0]
    });
    const [materialFile, setMaterialFile] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isSavingMaterial, setIsSavingMaterial] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showServiceModal, setShowServiceModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [serviceForm, setServiceForm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        fornitoreNome: '',
        importoFornitura: '',
        descrizione: '',
        preventivoRiferimento: '',
        dataPreventivo: new Date().toISOString().split('T')[0]
    });
    const [serviceFile, setServiceFile] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isSavingService, setIsSavingService] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const fetchFornitureMateriali = async (commessaId)=>{
        try {
            const res = await fetch(`${baseUrl}/api/commesse/${commessaId}/forniture-materiali`);
            if (!res.ok) throw new Error('Impossibile recuperare le forniture materiali');
            const data = await res.json();
            setFornitureMateriali(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Impossibile recuperare le forniture materiali');
        }
    };
    const fetchFornitureServizi = async (commessaId)=>{
        try {
            const res = await fetch(`${baseUrl}/api/commesse/${commessaId}/forniture-servizi`);
            if (!res.ok) throw new Error('Impossibile recuperare le forniture servizi');
            const data = await res.json();
            setFornitureServizi(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Impossibile recuperare le forniture servizi');
        }
    };
    const handleCreateFornituraMateriale = async (e)=>{
        e.preventDefault();
        if (!selectedCommessa) return;
        setIsSavingMaterial(true);
        setError(null);
        if (!materialFile) {
            setIsSavingMaterial(false);
            setError('Carica il preventivo della fornitura.');
            return;
        }
        try {
            const res = await fetch(`${baseUrl}/api/commesse/${selectedCommessa.id}/forniture-materiali`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    fornitoreNome: materialForm.fornitoreNome,
                    importoFornitura: parseFloat(materialForm.importoFornitura),
                    descrizione: materialForm.descrizione || undefined,
                    preventivoRiferimento: materialForm.preventivoRiferimento,
                    dataPreventivo: materialForm.dataPreventivo
                })
            });
            if (!res.ok) {
                const errData = await res.json().catch(()=>({}));
                const errorMessage = Array.isArray(errData.message) ? errData.message.join(' | ') : errData.message || 'Errore durante il salvataggio della fornitura';
                throw new Error(errorMessage);
            }
            const filePayload = new FormData();
            filePayload.append('file', materialFile);
            filePayload.append('entitaTipo', 'COMMESSA');
            filePayload.append('entitaId', selectedCommessa.id);
            filePayload.append('categoria', 'Offerte forniture di materiali');
            filePayload.append('sottocategoria', materialForm.fornitoreNome);
            const uploadRes = await fetch(`${baseUrl}/api/documenti/upload`, {
                method: 'POST',
                body: filePayload
            });
            if (!uploadRes.ok) {
                const errData = await uploadRes.json().catch(()=>({}));
                const errorMessage = Array.isArray(errData.message) ? errData.message.join(' | ') : errData.message || 'Errore durante il caricamento del preventivo';
                throw new Error(errorMessage);
            }
            setShowMaterialModal(false);
            setMaterialForm({
                fornitoreNome: '',
                importoFornitura: '',
                descrizione: '',
                preventivoRiferimento: '',
                dataPreventivo: new Date().toISOString().split('T')[0]
            });
            setMaterialFile(null);
            await fetchFornitureMateriali(selectedCommessa.id);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Errore durante il salvataggio della fornitura materiale');
        } finally{
            setIsSavingMaterial(false);
        }
    };
    const handleCreateFornituraServizio = async (e)=>{
        e.preventDefault();
        if (!selectedCommessa) return;
        setIsSavingService(true);
        setError(null);
        if (!serviceFile) {
            setIsSavingService(false);
            setError('Carica il preventivo del servizio.');
            return;
        }
        try {
            const res = await fetch(`${baseUrl}/api/commesse/${selectedCommessa.id}/forniture-servizi`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    fornitoreNome: serviceForm.fornitoreNome,
                    importoFornitura: parseFloat(serviceForm.importoFornitura),
                    descrizione: serviceForm.descrizione || undefined,
                    preventivoRiferimento: serviceForm.preventivoRiferimento,
                    dataPreventivo: serviceForm.dataPreventivo
                })
            });
            if (!res.ok) {
                const errData = await res.json().catch(()=>({}));
                const errorMessage = Array.isArray(errData.message) ? errData.message.join(' | ') : errData.message || 'Errore durante il salvataggio del servizio';
                throw new Error(errorMessage);
            }
            const filePayload = new FormData();
            filePayload.append('file', serviceFile);
            filePayload.append('entitaTipo', 'COMMESSA');
            filePayload.append('entitaId', selectedCommessa.id);
            filePayload.append('categoria', 'Offerte forniture di servizi');
            filePayload.append('sottocategoria', serviceForm.fornitoreNome);
            const uploadRes = await fetch(`${baseUrl}/api/documenti/upload`, {
                method: 'POST',
                body: filePayload
            });
            if (!uploadRes.ok) {
                const errData = await uploadRes.json().catch(()=>({}));
                const errorMessage = Array.isArray(errData.message) ? errData.message.join(' | ') : errData.message || 'Errore durante il caricamento del preventivo';
                throw new Error(errorMessage);
            }
            setShowServiceModal(false);
            setServiceForm({
                fornitoreNome: '',
                importoFornitura: '',
                descrizione: '',
                preventivoRiferimento: '',
                dataPreventivo: new Date().toISOString().split('T')[0]
            });
            setServiceFile(null);
            await fetchFornitureServizi(selectedCommessa.id);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Errore durante il salvataggio della fornitura servizio');
        } finally{
            setIsSavingService(false);
        }
    };
    return {
        fornitureMateriali,
        setFornitureMateriali,
        fornitureServizi,
        setFornitureServizi,
        showMaterialModal,
        setShowMaterialModal,
        materialForm,
        setMaterialForm,
        materialFile,
        setMaterialFile,
        isSavingMaterial,
        showServiceModal,
        setShowServiceModal,
        serviceForm,
        setServiceForm,
        serviceFile,
        setServiceFile,
        isSavingService,
        fetchFornitureMateriali,
        fetchFornitureServizi,
        handleCreateFornituraMateriale,
        handleCreateFornituraServizio
    };
}
_s(useForniture, "CIpffyN2/ffkRVwdlgOh+3+muFM=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/web/app/hooks/useJobPolling.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useJobPolling",
    ()=>useJobPolling
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.2.6_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
'use client';
;
const TERMINAL_STATES = [
    'COMPLETATO',
    'ERRORE'
];
const POLL_INTERVAL_MS = 3000;
function useJobPolling(baseUrl) {
    _s();
    const [activeJob, setActiveJob] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [recentJobs, setRecentJobs] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [isPolling, setIsPolling] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const pollTimerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const stopPolling = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useJobPolling.useCallback[stopPolling]": ()=>{
            if (pollTimerRef.current) {
                clearTimeout(pollTimerRef.current);
                pollTimerRef.current = null;
            }
            setIsPolling(false);
        }
    }["useJobPolling.useCallback[stopPolling]"], []);
    const fetchJobStatus = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useJobPolling.useCallback[fetchJobStatus]": async (jobId)=>{
            try {
                const res = await fetch(`${baseUrl}/api/jobs/${jobId}`);
                if (!res.ok) return null;
                return await res.json();
            } catch  {
                return null;
            }
        }
    }["useJobPolling.useCallback[fetchJobStatus]"], [
        baseUrl
    ]);
    const pollJob = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useJobPolling.useCallback[pollJob]": async (jobId)=>{
            const job = await fetchJobStatus(jobId);
            if (!job) return;
            setActiveJob(job);
            if (TERMINAL_STATES.includes(job.stato)) {
                stopPolling();
                // Aggiorna la lista dei job recenti
                setRecentJobs({
                    "useJobPolling.useCallback[pollJob]": (prev)=>{
                        const filtered = prev.filter({
                            "useJobPolling.useCallback[pollJob].filtered": (j)=>j.id !== job.id
                        }["useJobPolling.useCallback[pollJob].filtered"]);
                        return [
                            job,
                            ...filtered
                        ].slice(0, 10);
                    }
                }["useJobPolling.useCallback[pollJob]"]);
            } else {
                pollTimerRef.current = setTimeout({
                    "useJobPolling.useCallback[pollJob]": ()=>pollJob(jobId)
                }["useJobPolling.useCallback[pollJob]"], POLL_INTERVAL_MS);
            }
        }
    }["useJobPolling.useCallback[pollJob]"], [
        fetchJobStatus,
        stopPolling
    ]);
    const startPolling = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useJobPolling.useCallback[startPolling]": (jobId)=>{
            stopPolling();
            setIsPolling(true);
            pollJob(jobId);
        }
    }["useJobPolling.useCallback[startPolling]"], [
        stopPolling,
        pollJob
    ]);
    const fetchRecentJobs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useJobPolling.useCallback[fetchRecentJobs]": async ()=>{
            try {
                const res = await fetch(`${baseUrl}/api/jobs?limit=10`);
                if (!res.ok) return;
                const data = await res.json();
                setRecentJobs(data);
                // Se c'è un job attivo non terminale, riprendi il polling
                const runningJob = data.find({
                    "useJobPolling.useCallback[fetchRecentJobs].runningJob": (j)=>!TERMINAL_STATES.includes(j.stato)
                }["useJobPolling.useCallback[fetchRecentJobs].runningJob"]);
                if (runningJob) {
                    startPolling(runningJob.id);
                }
            } catch  {}
        }
    }["useJobPolling.useCallback[fetchRecentJobs]"], [
        baseUrl,
        startPolling
    ]);
    const dismissJob = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useJobPolling.useCallback[dismissJob]": ()=>{
            setActiveJob(null);
        }
    }["useJobPolling.useCallback[dismissJob]"], []);
    // Cleanup al unmount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useJobPolling.useEffect": ()=>{
            return ({
                "useJobPolling.useEffect": ()=>stopPolling()
            })["useJobPolling.useEffect"];
        }
    }["useJobPolling.useEffect"], [
        stopPolling
    ]);
    return {
        activeJob,
        recentJobs,
        isPolling,
        startPolling,
        fetchRecentJobs,
        dismissJob
    };
}
_s(useJobPolling, "LPfeH/KgrhliHhhswjgM4BbUK/E=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/web/app/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>App
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.2.6_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$468$2e$0_react$40$19$2e$2$2e$4$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.468.0_react@19.2.4/node_modules/lucide-react/dist/esm/icons/circle-alert.js [app-client] (ecmascript) <export default as AlertCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$468$2e$0_react$40$19$2e$2$2e$4$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.468.0_react@19.2.4/node_modules/lucide-react/dist/esm/icons/triangle-alert.js [app-client] (ecmascript) <export default as AlertTriangle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$468$2e$0_react$40$19$2e$2$2e$4$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$archive$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Archive$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.468.0_react@19.2.4/node_modules/lucide-react/dist/esm/icons/archive.js [app-client] (ecmascript) <export default as Archive>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$468$2e$0_react$40$19$2e$2$2e$4$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.468.0_react@19.2.4/node_modules/lucide-react/dist/esm/icons/arrow-left.js [app-client] (ecmascript) <export default as ArrowLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$468$2e$0_react$40$19$2e$2$2e$4$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$briefcase$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Briefcase$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.468.0_react@19.2.4/node_modules/lucide-react/dist/esm/icons/briefcase.js [app-client] (ecmascript) <export default as Briefcase>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$468$2e$0_react$40$19$2e$2$2e$4$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.468.0_react@19.2.4/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-client] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$468$2e$0_react$40$19$2e$2$2e$4$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$out$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LogOut$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.468.0_react@19.2.4/node_modules/lucide-react/dist/esm/icons/log-out.js [app-client] (ecmascript) <export default as LogOut>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$468$2e$0_react$40$19$2e$2$2e$4$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.468.0_react@19.2.4/node_modules/lucide-react/dist/esm/icons/map-pin.js [app-client] (ecmascript) <export default as MapPin>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$468$2e$0_react$40$19$2e$2$2e$4$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.468.0_react@19.2.4/node_modules/lucide-react/dist/esm/icons/trash-2.js [app-client] (ecmascript) <export default as Trash2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$468$2e$0_react$40$19$2e$2$2e$4$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.468.0_react@19.2.4/node_modules/lucide-react/dist/esm/icons/user.js [app-client] (ecmascript) <export default as User>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$468$2e$0_react$40$19$2e$2$2e$4$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__UserCheck$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.468.0_react@19.2.4/node_modules/lucide-react/dist/esm/icons/user-check.js [app-client] (ecmascript) <export default as UserCheck>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$468$2e$0_react$40$19$2e$2$2e$4$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.468.0_react@19.2.4/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.2.6_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$app$2f$components$2f$ConfirmModals$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/app/components/ConfirmModals.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$app$2f$components$2f$ContrattoClienteModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/app/components/ContrattoClienteModal.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$app$2f$components$2f$ContrattoFornitoreModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/app/components/ContrattoFornitoreModal.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$app$2f$components$2f$CreateCommessaModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/app/components/CreateCommessaModal.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$app$2f$components$2f$DashboardView$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/app/components/DashboardView.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$app$2f$components$2f$DocProgettualeModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/app/components/DocProgettualeModal.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$app$2f$components$2f$FornitoreDocModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/app/components/FornitoreDocModal.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$app$2f$components$2f$FornituraModals$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/app/components/FornituraModals.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$app$2f$components$2f$JobProgressBar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/app/components/JobProgressBar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$app$2f$components$2f$PreviewModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/app/components/PreviewModal.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$app$2f$components$2f$TabContabilita$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/app/components/TabContabilita.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$app$2f$components$2f$TabDocumenti$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/app/components/TabDocumenti.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$app$2f$components$2f$TabFornitori$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/app/components/TabFornitori.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$app$2f$components$2f$TabSintesi$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/app/components/TabSintesi.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$app$2f$components$2f$VarianteModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/app/components/VarianteModal.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$app$2f$context$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/app/context/AuthContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$app$2f$hooks$2f$useAppaltoVoci$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/app/hooks/useAppaltoVoci.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$app$2f$hooks$2f$useCommesse$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/app/hooks/useCommesse.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$app$2f$hooks$2f$useDocumenti$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/app/hooks/useDocumenti.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$app$2f$hooks$2f$useForniture$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/app/hooks/useForniture.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$app$2f$hooks$2f$useJobPolling$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/app/hooks/useJobPolling.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
function App() {
    _s();
    const { user, token, logout, isLoading: authLoading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$app$2f$context$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const baseUrl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "App.useMemo[baseUrl]": ()=>("TURBOPACK compile-time truthy", 1) ? window.location.origin : "TURBOPACK unreachable"
    }["App.useMemo[baseUrl]"], []);
    // Redirect al login se non autenticato
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "App.useEffect": ()=>{
            if (!authLoading && !token) {
                window.location.href = '/login';
            }
        }
    }["App.useEffect"], [
        authLoading,
        token
    ]);
    const commesse = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$app$2f$hooks$2f$useCommesse$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCommesse"])(baseUrl, setError);
    const appalto = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$app$2f$hooks$2f$useAppaltoVoci$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppaltoVoci"])(baseUrl, commesse.selectedCommessa?.id ?? null, setError);
    const forniture = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$app$2f$hooks$2f$useForniture$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useForniture"])(baseUrl, commesse.selectedCommessa, setError);
    const documenti = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$app$2f$hooks$2f$useDocumenti$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDocumenti"])(baseUrl, commesse.selectedCommessa, setError);
    const jobs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$app$2f$hooks$2f$useJobPolling$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useJobPolling"])(baseUrl);
    // Documenti Pending
    const [pendingDocs, setPendingDocs] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const fetchPendingDocs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "App.useCallback[fetchPendingDocs]": async ()=>{
            try {
                const res = await fetch(`${baseUrl}/api/documenti/pending`);
                if (res.ok) setPendingDocs(await res.json());
            } catch  {}
        }
    }["App.useCallback[fetchPendingDocs]"], [
        baseUrl
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "App.useEffect": ()=>{
            fetchPendingDocs();
        }
    }["App.useEffect"], [
        fetchPendingDocs
    ]);
    const handleUpdatePendingDocStato = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "App.useCallback[handleUpdatePendingDocStato]": async (docId, stato)=>{
            try {
                await fetch(`${baseUrl}/api/documenti/${docId}/stato`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        stato
                    })
                });
                await fetchPendingDocs();
            } catch  {}
        }
    }["App.useCallback[handleUpdatePendingDocStato]"], [
        baseUrl,
        fetchPendingDocs
    ]);
    // Job polling: riprendi eventuali job attivi all'avvio
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "App.useEffect": ()=>{
            jobs.fetchRecentJobs();
        }
    }["App.useEffect"], [
        baseUrl
    ]);
    const fetchDetail = async (id, tab)=>{
        try {
            commesse.setLoading(true);
            commesse.setDeleteInfo(null);
            const res = await fetch(`${baseUrl}/api/commesse/${id}`);
            if (!res.ok) throw new Error('Dettaglio non disponibile');
            const data = await res.json();
            commesse.setSelectedCommessa(data);
            commesse.setView('detail');
            commesse.setActiveTab(tab || 'sintesi');
            await Promise.all([
                documenti.fetchDocumenti(data.id),
                forniture.fetchFornitureMateriali(data.id),
                forniture.fetchFornitureServizi(data.id),
                appalto.fetchAppaltoVoci(data.id)
            ]);
            await commesse.fetchDeleteInfo(data.id);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Errore inatteso durante il caricamento della commessa');
        } finally{
            commesse.setLoading(false);
        }
    };
    const detailTabs = [
        {
            id: 'sintesi',
            label: 'Sintesi & Avanzamento'
        },
        {
            id: 'documenti',
            label: 'Archivio Documentale'
        },
        {
            id: 'fornitori',
            label: 'Gestione Fornitori'
        },
        {
            id: 'contabilita',
            label: 'Contabilità'
        }
    ];
    if (authLoading || !token) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen bg-[#FBFBFB] flex items-center justify-center",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$468$2e$0_react$40$19$2e$2$2e$4$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                className: "animate-spin text-[#0054B4] stroke-[1px]",
                size: 32
            }, void 0, false, {
                fileName: "[project]/apps/web/app/page.tsx",
                lineNumber: 105,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/apps/web/app/page.tsx",
            lineNumber: 104,
            columnNumber: 7
        }, this);
    }
    if (commesse.loading && commesse.view === 'dashboard') {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen bg-[#FBFBFB] flex items-center justify-center",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$468$2e$0_react$40$19$2e$2$2e$4$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                className: "animate-spin text-[#0054B4] stroke-[1px]",
                size: 32
            }, void 0, false, {
                fileName: "[project]/apps/web/app/page.tsx",
                lineNumber: 113,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/apps/web/app/page.tsx",
            lineNumber: 112,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen flex font-sans selection:bg-[#0054B4]/5 bg-texture",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                className: "w-20 bg-[#003A7D] flex flex-col items-center py-8 gap-8 sticky top-0 h-screen z-50 shadow-md",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>{
                            commesse.setView('dashboard');
                            commesse.setSelectedCommessa(null);
                        },
                        className: "flex flex-col items-center gap-1.5 group px-1",
                        title: "Bresciani Group - Home",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-white font-black text-base tracking-tight leading-none group-hover:text-blue-200 transition-colors",
                                children: "B"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/app/page.tsx",
                                lineNumber: 126,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-white/50 font-black text-[8px] tracking-widest uppercase leading-none group-hover:text-white/80 transition-colors",
                                children: "Group"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/app/page.tsx",
                                lineNumber: 127,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/app/page.tsx",
                        lineNumber: 121,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                        className: "flex flex-col gap-6 w-full",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "relative flex items-center justify-center group",
                            children: [
                                commesse.view === 'dashboard' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "absolute left-0 w-1 h-6 bg-white rounded-r-full"
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/app/page.tsx",
                                    lineNumber: 132,
                                    columnNumber: 47
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>commesse.setView('dashboard'),
                                    className: `relative p-4 rounded-xl transition-all ${commesse.view === 'dashboard' ? 'text-white bg-white/10 shadow-inner' : 'text-white/30 hover:text-white/70 hover:bg-white/5'}`,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$468$2e$0_react$40$19$2e$2$2e$4$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$briefcase$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Briefcase$3e$__["Briefcase"], {
                                            size: 22,
                                            strokeWidth: 2.5
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/app/page.tsx",
                                            lineNumber: 137,
                                            columnNumber: 15
                                        }, this),
                                        pendingDocs.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "absolute top-2 right-2 min-w-[14px] h-[14px] flex items-center justify-center rounded-full bg-amber-400 text-[7px] font-black text-[#003A7D] px-0.5",
                                            children: pendingDocs.length
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/app/page.tsx",
                                            lineNumber: 139,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/web/app/page.tsx",
                                    lineNumber: 133,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/web/app/page.tsx",
                            lineNumber: 131,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/apps/web/app/page.tsx",
                        lineNumber: 130,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-auto flex flex-col items-center gap-3 pb-2",
                        children: [
                            user && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-white/40 text-[8px] uppercase tracking-widest text-center leading-tight px-1",
                                title: user.email,
                                children: user.nome || user.email.split('@')[0]
                            }, void 0, false, {
                                fileName: "[project]/apps/web/app/page.tsx",
                                lineNumber: 149,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: logout,
                                title: "Esci",
                                className: "p-3 rounded-xl text-white/30 hover:text-white/80 hover:bg-white/10 transition-all",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$468$2e$0_react$40$19$2e$2$2e$4$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$out$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LogOut$3e$__["LogOut"], {
                                    size: 18,
                                    strokeWidth: 2
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/app/page.tsx",
                                    lineNumber: 158,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/apps/web/app/page.tsx",
                                lineNumber: 153,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/app/page.tsx",
                        lineNumber: 147,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/app/page.tsx",
                lineNumber: 120,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                className: "flex-1 p-16 max-w-[1200px] mx-auto w-full",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "cursor-pointer group w-full flex flex-col items-center text-center mb-12",
                        onClick: ()=>{
                            commesse.setView('dashboard');
                            commesse.setSelectedCommessa(null);
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "font-bold tracking-[0.4em] text-[9px] uppercase text-[#0054B4] mb-2",
                                children: "Gestionale Operativo"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/app/page.tsx",
                                lineNumber: 168,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "text-6xl font-extralight tracking-tighter text-[#003A7D] group-hover:text-[#0054B4] transition-colors leading-none",
                                children: [
                                    "Bresciani ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "font-medium",
                                        children: "Group"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/app/page.tsx",
                                        lineNumber: 170,
                                        columnNumber: 23
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/app/page.tsx",
                                lineNumber: 169,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-full h-[1px] bg-[#003A7D] mt-3"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/app/page.tsx",
                                lineNumber: 172,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/app/page.tsx",
                        lineNumber: 164,
                        columnNumber: 9
                    }, this),
                    commesse.view === 'dashboard' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$app$2f$components$2f$DashboardView$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DashboardView"], {
                        commesse: commesse.commesse,
                        stats: commesse.stats,
                        pendingDocs: pendingDocs,
                        onOpenDetail: fetchDetail,
                        onPreviewDoc: (doc)=>documenti.setPreviewDoc(doc),
                        onCreateCommessa: ()=>commesse.setShowCreateModal(true),
                        onDeleteFromHome: (c)=>{
                            commesse.setCommessaToDelete(c);
                            commesse.setShowHomeDeleteModal(true);
                        },
                        onUpdatePendingDocStato: handleUpdatePendingDocStato,
                        page: commesse.page,
                        totalPages: commesse.totalPages,
                        total: commesse.total,
                        onPageChange: (p)=>commesse.fetchCommesse(p),
                        pmFolders: commesse.pmFolders,
                        onFilterChange: commesse.applyFilters
                    }, void 0, false, {
                        fileName: "[project]/apps/web/app/page.tsx",
                        lineNumber: 176,
                        columnNumber: 11
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "animate-in fade-in slide-in-from-bottom-4 duration-700",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>{
                                    commesse.setView('dashboard');
                                    commesse.setSelectedCommessa(null);
                                },
                                className: "group flex items-center gap-2 text-[#0054B4] font-bold uppercase text-[8px] tracking-[0.4em] mb-12 hover:translate-x-[-2px] transition-all",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$468$2e$0_react$40$19$2e$2$2e$4$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__["ArrowLeft"], {
                                        size: 12,
                                        strokeWidth: 2.5
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/app/page.tsx",
                                        lineNumber: 198,
                                        columnNumber: 15
                                    }, this),
                                    " Torna alla Dashboard"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/app/page.tsx",
                                lineNumber: 194,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                                className: "mb-8 flex justify-between items-end",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-[#0054B4] font-bold text-[9px] tracking-[0.4em] uppercase mb-4",
                                                children: "Scheda Tecnica Operativa"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/app/page.tsx",
                                                lineNumber: 203,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                className: "text-4xl font-black text-[#003A7D] tracking-tighter leading-none uppercase",
                                                children: commesse.selectedCommessa?.codiceIdentificativo
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/app/page.tsx",
                                                lineNumber: 204,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex flex-wrap items-center gap-3 mt-3 text-[9px] uppercase tracking-widest",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "inline-flex items-center px-3 py-1 rounded-full bg-[#0054B4]/10 text-[#0054B4] font-black",
                                                        children: commesse.selectedCommessa?.tipoLavori || 'Tipologia non definita'
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/web/app/page.tsx",
                                                        lineNumber: 208,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-stone-300",
                                                        children: "•"
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/web/app/page.tsx",
                                                        lineNumber: 211,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-stone-500 flex items-center gap-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$468$2e$0_react$40$19$2e$2$2e$4$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__["MapPin"], {
                                                                size: 14
                                                            }, void 0, false, {
                                                                fileName: "[project]/apps/web/app/page.tsx",
                                                                lineNumber: 213,
                                                                columnNumber: 21
                                                            }, this),
                                                            commesse.selectedCommessa?.citta ? `${commesse.selectedCommessa.indirizzo}, ${commesse.selectedCommessa.cap} ${commesse.selectedCommessa.citta}` : commesse.selectedCommessa?.indirizzo || 'Indirizzo non presente'
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/apps/web/app/page.tsx",
                                                        lineNumber: 212,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/apps/web/app/page.tsx",
                                                lineNumber: 207,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/web/app/page.tsx",
                                        lineNumber: 202,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-right flex flex-col items-end gap-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>commesse.setShowCloseModal(true),
                                                className: "flex items-center gap-2 px-4 py-2 bg-white border border-stone-200 text-[#003A7D] hover:bg-stone-50 hover:border-[#0054B4] rounded-lg text-[9px] font-black uppercase tracking-widest transition-all",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$468$2e$0_react$40$19$2e$2$2e$4$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$archive$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Archive$3e$__["Archive"], {
                                                        size: 12,
                                                        strokeWidth: 2.5
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/web/app/page.tsx",
                                                        lineNumber: 225,
                                                        columnNumber: 19
                                                    }, this),
                                                    "Chiudi Cantiere"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/apps/web/app/page.tsx",
                                                lineNumber: 221,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>commesse.setShowDeleteModal(true),
                                                className: "flex items-center gap-2 px-4 py-2 bg-white border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$468$2e$0_react$40$19$2e$2$2e$4$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                                        size: 12,
                                                        strokeWidth: 2.5
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/web/app/page.tsx",
                                                        lineNumber: 232,
                                                        columnNumber: 19
                                                    }, this),
                                                    "Elimina Commessa"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/apps/web/app/page.tsx",
                                                lineNumber: 228,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/web/app/page.tsx",
                                        lineNumber: 220,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/app/page.tsx",
                                lineNumber: 201,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-4 mb-10 pb-10 border-b border-stone-200",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "px-4 py-3 bg-white border border-stone-200 rounded-xl shadow-sm flex items-center gap-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "w-8 h-8 bg-stone-100 rounded-lg flex items-center justify-center text-stone-500",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$468$2e$0_react$40$19$2e$2$2e$4$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"], {
                                                    size: 14
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/web/app/page.tsx",
                                                    lineNumber: 240,
                                                    columnNumber: 114
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/app/page.tsx",
                                                lineNumber: 240,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-[8px] font-black text-stone-400 uppercase block tracking-widest",
                                                        children: "Committente"
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/web/app/page.tsx",
                                                        lineNumber: 242,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-xs font-bold text-[#003A7D] uppercase",
                                                        children: commesse.selectedCommessa?.nomeCliente || 'N/D'
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/web/app/page.tsx",
                                                        lineNumber: 243,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/apps/web/app/page.tsx",
                                                lineNumber: 241,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/web/app/page.tsx",
                                        lineNumber: 239,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "px-4 py-3 bg-white border border-stone-200 rounded-xl shadow-sm flex items-center gap-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-[#0054B4]",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$468$2e$0_react$40$19$2e$2$2e$4$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__UserCheck$3e$__["UserCheck"], {
                                                    size: 14
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/web/app/page.tsx",
                                                    lineNumber: 247,
                                                    columnNumber: 112
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/app/page.tsx",
                                                lineNumber: 247,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-[8px] font-black text-[#0054B4]/70 uppercase block tracking-widest",
                                                        children: "Project Manager"
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/web/app/page.tsx",
                                                        lineNumber: 249,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-xs font-bold text-[#0054B4] uppercase",
                                                        children: commesse.selectedCommessa?.responsabile || 'N/D'
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/web/app/page.tsx",
                                                        lineNumber: 250,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/apps/web/app/page.tsx",
                                                lineNumber: 248,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/web/app/page.tsx",
                                        lineNumber: 246,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/app/page.tsx",
                                lineNumber: 238,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex gap-8 border-b border-stone-200 mb-8",
                                children: detailTabs.map((tab)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>commesse.setActiveTab(tab.id),
                                        className: `pb-4 text-xs font-black uppercase tracking-widest transition-all relative ${commesse.activeTab === tab.id ? 'text-[#0054B4]' : 'text-[#003A7D]/50 hover:text-[#003A7D]/80'}`,
                                        children: [
                                            tab.label,
                                            commesse.activeTab === tab.id && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "absolute bottom-0 left-0 w-full h-[2px] bg-[#0054B4] rounded-t-full"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/app/page.tsx",
                                                lineNumber: 264,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, tab.id, true, {
                                        fileName: "[project]/apps/web/app/page.tsx",
                                        lineNumber: 257,
                                        columnNumber: 17
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/apps/web/app/page.tsx",
                                lineNumber: 255,
                                columnNumber: 13
                            }, this),
                            commesse.activeTab === 'sintesi' && commesse.selectedCommessa && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$app$2f$components$2f$TabSintesi$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TabSintesi"], {
                                selectedCommessa: commesse.selectedCommessa,
                                appaltoRowsFlat: appalto.appaltoRowsFlat,
                                isSavingAppalto: appalto.isSavingAppalto,
                                onAddRow: appalto.handleAddAppaltoRow,
                                onAddChildRow: appalto.handleAddAppaltoChildRow,
                                onUpdateRow: appalto.handleUpdateAppaltoRow,
                                onRemoveRow: appalto.handleRemoveAppaltoRow,
                                onToggleRow: appalto.toggleAppaltoRow,
                                onSave: appalto.handleSaveAppaltoRows,
                                onUpdateDataInizioLavori: commesse.handleUpdateDataInizioLavori
                            }, void 0, false, {
                                fileName: "[project]/apps/web/app/page.tsx",
                                lineNumber: 271,
                                columnNumber: 15
                            }, this),
                            commesse.activeTab === 'documenti' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$app$2f$components$2f$TabDocumenti$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TabDocumenti"], {
                                documenti: documenti.documenti,
                                baseUrl: baseUrl,
                                fornitoriEsistenti: documenti.fornitoriEsistenti,
                                setPreviewDoc: documenti.setPreviewDoc,
                                onDeleteVariante: documenti.handleDeleteVariante,
                                onOpenContrattoCliente: ()=>documenti.setShowContrattoClienteModal(true),
                                onOpenContrattoFornitore: ()=>documenti.openContrattoFornitore(documenti.fornitoriEsistenti),
                                onOpenDocProgettuale: ()=>documenti.setShowDocProgettualeModal(true),
                                onOpenVariante: (baseContratti)=>documenti.openVarianteForNew(baseContratti),
                                onEditVariante: (id, vm, baseContratti)=>documenti.openVarianteForEdit(id, vm, baseContratti),
                                onAllegatiClienteUpload: documenti.handleAllegatiClienteUpload,
                                onAllegatiFornitoreUpload: documenti.handleAllegatiFornitoreUpload
                            }, void 0, false, {
                                fileName: "[project]/apps/web/app/page.tsx",
                                lineNumber: 286,
                                columnNumber: 15
                            }, this),
                            commesse.activeTab === 'fornitori' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$app$2f$components$2f$TabFornitori$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TabFornitori"], {
                                fornitoriDaDocumenti: documenti.fornitoriDaDocumenti,
                                docOperativiPerFornitore: documenti.docOperativiPerFornitore,
                                baseUrl: baseUrl,
                                handleUpdateDocStato: documenti.handleUpdateDocStato,
                                setPreviewDoc: documenti.setPreviewDoc,
                                onAddDocForFornitore: (fornitore)=>documenti.openFornitoreDoc(fornitore)
                            }, void 0, false, {
                                fileName: "[project]/apps/web/app/page.tsx",
                                lineNumber: 303,
                                columnNumber: 15
                            }, this),
                            commesse.activeTab === 'contabilita' && commesse.selectedCommessa && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$app$2f$components$2f$TabContabilita$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TabContabilita"], {
                                commessaId: commesse.selectedCommessa.id,
                                baseUrl: baseUrl
                            }, void 0, false, {
                                fileName: "[project]/apps/web/app/page.tsx",
                                lineNumber: 314,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/app/page.tsx",
                        lineNumber: 193,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/app/page.tsx",
                lineNumber: 163,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$app$2f$components$2f$PreviewModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PreviewModal"], {
                previewDoc: documenti.previewDoc,
                setPreviewDoc: documenti.setPreviewDoc,
                baseUrl: baseUrl
            }, void 0, false, {
                fileName: "[project]/apps/web/app/page.tsx",
                lineNumber: 323,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$app$2f$components$2f$CreateCommessaModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CreateCommessaModal"], {
                isOpen: commesse.showCreateModal,
                success: commesse.success,
                submitting: commesse.submitting,
                formData: commesse.formData,
                setFormData: commesse.setFormData,
                pmFolders: commesse.pmFolders,
                pmMode: commesse.pmMode,
                setPmMode: commesse.setPmMode,
                onClose: commesse.handleCloseCreateModal,
                onSubmit: commesse.handleCreateCommessa
            }, void 0, false, {
                fileName: "[project]/apps/web/app/page.tsx",
                lineNumber: 325,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$app$2f$components$2f$ConfirmModals$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ConfirmModals"], {
                showCloseModal: commesse.showCloseModal,
                onCloseCancel: ()=>commesse.setShowCloseModal(false),
                onCloseConfirm: commesse.handleCloseCommessa,
                showDeleteModal: commesse.showDeleteModal,
                onDeleteCancel: ()=>commesse.setShowDeleteModal(false),
                onDeleteConfirm: commesse.handleDeleteCommessa,
                showHomeDeleteModal: commesse.showHomeDeleteModal,
                onHomeDeleteCancel: ()=>commesse.setShowHomeDeleteModal(false),
                onHomeDeleteConfirm: commesse.handleDeleteFromHome,
                selectedCommessa: commesse.selectedCommessa,
                commessaToDelete: commesse.commessaToDelete,
                deleteInfo: commesse.deleteInfo,
                isClosing: commesse.isClosing,
                isDeleting: commesse.isDeleting
            }, void 0, false, {
                fileName: "[project]/apps/web/app/page.tsx",
                lineNumber: 338,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$app$2f$components$2f$FornituraModals$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FornituraModals"], {
                showMaterialModal: forniture.showMaterialModal,
                onMaterialClose: ()=>forniture.setShowMaterialModal(false),
                showServiceModal: forniture.showServiceModal,
                onServiceClose: ()=>forniture.setShowServiceModal(false),
                materialForm: forniture.materialForm,
                setMaterialForm: forniture.setMaterialForm,
                materialFile: forniture.materialFile,
                setMaterialFile: forniture.setMaterialFile,
                serviceForm: forniture.serviceForm,
                setServiceForm: forniture.setServiceForm,
                serviceFile: forniture.serviceFile,
                setServiceFile: forniture.setServiceFile,
                isSavingMaterial: forniture.isSavingMaterial,
                isSavingService: forniture.isSavingService,
                onMaterialSubmit: forniture.handleCreateFornituraMateriale,
                onServiceSubmit: forniture.handleCreateFornituraServizio
            }, void 0, false, {
                fileName: "[project]/apps/web/app/page.tsx",
                lineNumber: 355,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$app$2f$components$2f$ContrattoClienteModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ContrattoClienteModal"], {
                isOpen: documenti.showContrattoClienteModal,
                onClose: ()=>documenti.setShowContrattoClienteModal(false),
                form: documenti.contrattoClienteForm,
                setForm: documenti.setContrattoClienteForm,
                files: documenti.contrattoClienteFiles,
                setFiles: documenti.setContrattoClienteFiles,
                isSaving: documenti.isSavingContrattoCliente,
                onSubmit: documenti.handleContrattoClienteUpload
            }, void 0, false, {
                fileName: "[project]/apps/web/app/page.tsx",
                lineNumber: 374,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$app$2f$components$2f$VarianteModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["VarianteModal"], {
                isOpen: documenti.showVarianteModal,
                onClose: ()=>documenti.setShowVarianteModal(false),
                form: documenti.varianteForm,
                setForm: documenti.setVarianteForm,
                files: documenti.varianteFiles,
                setFiles: documenti.setVarianteFiles,
                isSaving: documenti.isSavingVariante,
                baseContratti: documenti.varianteBaseContratti,
                editingId: documenti.editingVarianteId,
                fornitoriEsistenti: documenti.fornitoriEsistenti,
                onSubmit: documenti.handleVarianteUpload
            }, void 0, false, {
                fileName: "[project]/apps/web/app/page.tsx",
                lineNumber: 385,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$app$2f$components$2f$ContrattoFornitoreModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ContrattoFornitoreModal"], {
                isOpen: documenti.showContrattoFornitoreModal,
                onClose: ()=>documenti.setShowContrattoFornitoreModal(false),
                form: documenti.contrattoFornitoreForm,
                setForm: documenti.setContrattoFornitoreForm,
                files: documenti.contrattoFornitoreFiles,
                setFiles: documenti.setContrattoFornitoreFiles,
                isSaving: documenti.isSavingContrattoFornitore,
                fornitoriEsistenti: documenti.fornitoriEsistenti,
                onSubmit: documenti.handleContrattoFornitoreUpload
            }, void 0, false, {
                fileName: "[project]/apps/web/app/page.tsx",
                lineNumber: 399,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$app$2f$components$2f$DocProgettualeModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DocProgettualeModal"], {
                isOpen: documenti.showDocProgettualeModal,
                onClose: ()=>documenti.setShowDocProgettualeModal(false),
                form: documenti.docProgettualeForm,
                setForm: documenti.setDocProgettualeForm,
                files: documenti.docProgettualeFiles,
                setFiles: documenti.setDocProgettualeFiles,
                isSaving: documenti.isSavingDocProgettuale,
                onSubmit: documenti.handleDocProgettualeUpload
            }, void 0, false, {
                fileName: "[project]/apps/web/app/page.tsx",
                lineNumber: 411,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$app$2f$components$2f$FornitoreDocModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FornitoreDocModal"], {
                isOpen: documenti.showFornitoreDocModal,
                onClose: ()=>documenti.setShowFornitoreDocModal(false),
                fornitore: documenti.selectedFornitore,
                form: documenti.fornitoreDocForm,
                setForm: documenti.setFornitoreDocForm,
                files: documenti.fornitoreDocFiles,
                setFiles: documenti.setFornitoreDocFiles,
                isSaving: documenti.isSavingFornitoreDoc,
                onSubmit: documenti.handleFornitoreDocUpload
            }, void 0, false, {
                fileName: "[project]/apps/web/app/page.tsx",
                lineNumber: 422,
                columnNumber: 7
            }, this),
            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed bottom-6 right-6 bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-xl shadow-lg flex items-start gap-3 max-w-sm animate-in slide-in-from-bottom-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$468$2e$0_react$40$19$2e$2$2e$4$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__["AlertCircle"], {
                        className: "text-red-500",
                        size: 18
                    }, void 0, false, {
                        fileName: "[project]/apps/web/app/page.tsx",
                        lineNumber: 436,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-[10px] font-black uppercase tracking-widest mb-1",
                                children: "Errore"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/app/page.tsx",
                                lineNumber: 438,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm leading-relaxed",
                                children: error
                            }, void 0, false, {
                                fileName: "[project]/apps/web/app/page.tsx",
                                lineNumber: 439,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/app/page.tsx",
                        lineNumber: 437,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setError(null),
                        className: "text-red-400 hover:text-red-600 ml-auto",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$468$2e$0_react$40$19$2e$2$2e$4$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                            size: 14
                        }, void 0, false, {
                            fileName: "[project]/apps/web/app/page.tsx",
                            lineNumber: 442,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/apps/web/app/page.tsx",
                        lineNumber: 441,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/app/page.tsx",
                lineNumber: 435,
                columnNumber: 9
            }, this),
            documenti.isUploading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 bg-black/20 backdrop-blur-sm z-[110] flex items-center justify-center",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-white rounded-2xl px-6 py-4 shadow-xl flex items-center gap-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$468$2e$0_react$40$19$2e$2$2e$4$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                            className: "animate-spin text-[#0054B4]",
                            size: 20
                        }, void 0, false, {
                            fileName: "[project]/apps/web/app/page.tsx",
                            lineNumber: 450,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-sm font-bold text-[#003A7D]",
                            children: "Caricamento in corso..."
                        }, void 0, false, {
                            fileName: "[project]/apps/web/app/page.tsx",
                            lineNumber: 451,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/web/app/page.tsx",
                    lineNumber: 449,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/apps/web/app/page.tsx",
                lineNumber: 448,
                columnNumber: 9
            }, this),
            commesse.isClosing && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 bg-black/20 backdrop-blur-sm z-[110] flex items-center justify-center",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-white rounded-2xl px-6 py-4 shadow-xl flex items-center gap-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$468$2e$0_react$40$19$2e$2$2e$4$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$archive$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Archive$3e$__["Archive"], {
                            className: "text-[#0054B4]",
                            size: 20
                        }, void 0, false, {
                            fileName: "[project]/apps/web/app/page.tsx",
                            lineNumber: 459,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-sm font-bold text-[#003A7D]",
                            children: "Chiusura cantiere in corso..."
                        }, void 0, false, {
                            fileName: "[project]/apps/web/app/page.tsx",
                            lineNumber: 460,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/web/app/page.tsx",
                    lineNumber: 458,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/apps/web/app/page.tsx",
                lineNumber: 457,
                columnNumber: 9
            }, this),
            commesse.isDeleting && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 bg-black/20 backdrop-blur-sm z-[110] flex items-center justify-center",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-white rounded-2xl px-6 py-4 shadow-xl flex items-center gap-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$468$2e$0_react$40$19$2e$2$2e$4$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                            className: "text-red-500",
                            size: 20
                        }, void 0, false, {
                            fileName: "[project]/apps/web/app/page.tsx",
                            lineNumber: 468,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-sm font-bold text-[#003A7D]",
                            children: "Eliminazione in corso..."
                        }, void 0, false, {
                            fileName: "[project]/apps/web/app/page.tsx",
                            lineNumber: 469,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/web/app/page.tsx",
                    lineNumber: 467,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/apps/web/app/page.tsx",
                lineNumber: 466,
                columnNumber: 9
            }, this),
            jobs.activeJob && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$app$2f$components$2f$JobProgressBar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["JobProgressBar"], {
                job: jobs.activeJob,
                onDismiss: jobs.dismissJob
            }, void 0, false, {
                fileName: "[project]/apps/web/app/page.tsx",
                lineNumber: 476,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/app/page.tsx",
        lineNumber: 119,
        columnNumber: 5
    }, this);
}
_s(App, "DnlZ185MvXajARIEwZUaQM27Xmk=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$app$2f$context$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"],
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$app$2f$hooks$2f$useCommesse$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCommesse"],
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$app$2f$hooks$2f$useAppaltoVoci$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppaltoVoci"],
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$app$2f$hooks$2f$useForniture$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useForniture"],
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$app$2f$hooks$2f$useDocumenti$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDocumenti"],
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$app$2f$hooks$2f$useJobPolling$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useJobPolling"]
    ];
});
_c = App;
var _c;
__turbopack_context__.k.register(_c, "App");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=apps_web_app_13dmhb7._.js.map