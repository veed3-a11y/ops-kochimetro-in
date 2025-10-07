import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RulesPanel, Rule } from "@/components/RulesPanel";
import { RuleEditorModal } from "@/components/RuleEditorModal";
import { UserAccessTable, User } from "@/components/UserAccessTable";
import { IntegrationConfigCard, Integration } from "@/components/IntegrationConfigCard";
import { AuditTrailDrawer, AuditEntry } from "@/components/AuditTrailDrawer";
import { ArrowLeft, History, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function AdminConfigConsole() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("rules");
  const [isAuditDrawerOpen, setIsAuditDrawerOpen] = useState(false);
  const [isRuleEditorOpen, setIsRuleEditorOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<Rule | null>(null);

  // Mock data for rules
  const [rules, setRules] = useState<Rule[]>([
    {
      id: "1",
      name: "Fitness Certificate Validity",
      category: "fitness",
      condition: "must be ≥",
      value: "24 hours",
      status: "active",
      createdBy: "Admin User",
      updatedAt: "2025-10-06 14:30",
    },
    {
      id: "2",
      name: "Max Mileage Deviation",
      category: "mileage",
      condition: "across fleet ≤",
      value: "10%",
      status: "active",
      createdBy: "System Admin",
      updatedAt: "2025-10-05 09:15",
    },
    {
      id: "3",
      name: "Branding Exposure Minimum",
      category: "branding",
      condition: "must be ≥",
      value: "85% of target",
      status: "active",
      createdBy: "Admin User",
      updatedAt: "2025-10-04 16:20",
    },
    {
      id: "4",
      name: "Critical Job Cards Limit",
      category: "maintenance",
      condition: "must be <",
      value: "3 open cards",
      status: "active",
      createdBy: "Engineering Lead",
      updatedAt: "2025-10-03 11:45",
    },
    {
      id: "5",
      name: "Cleaning Completion Status",
      category: "cleaning",
      condition: "must be",
      value: "Completed",
      status: "inactive",
      createdBy: "Operations Manager",
      updatedAt: "2025-10-02 08:30",
    },
  ]);

  // Mock data for users
  const [users, setUsers] = useState<User[]>([
    {
      id: "1",
      name: "Rajesh Kumar",
      email: "rajesh.kumar@kmrl.com",
      role: "admin",
      status: "active",
      lastLogin: "2025-10-06 10:30",
    },
    {
      id: "2",
      name: "Priya Menon",
      email: "priya.menon@kmrl.com",
      role: "planner",
      status: "active",
      lastLogin: "2025-10-06 09:15",
    },
    {
      id: "3",
      name: "Arun Nair",
      email: "arun.nair@kmrl.com",
      role: "engineer",
      status: "active",
      lastLogin: "2025-10-05 16:45",
    },
    {
      id: "4",
      name: "Lakshmi Pillai",
      email: "lakshmi.pillai@kmrl.com",
      role: "viewer",
      status: "active",
      lastLogin: "2025-10-04 14:20",
    },
    {
      id: "5",
      name: "Suresh Babu",
      email: "suresh.babu@kmrl.com",
      role: "planner",
      status: "inactive",
      lastLogin: "2025-09-28 11:00",
    },
  ]);

  // Mock data for integrations
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: "1",
      name: "IBM Maximo",
      type: "Enterprise Asset Management",
      status: "connected",
      lastSync: "2025-10-06 14:45",
      errorCount: 0,
      apiKeyMasked: "sk_••••••••••••4a2f",
    },
    {
      id: "2",
      name: "IoT Sensor Feed",
      type: "Real-time Data Stream",
      status: "connected",
      lastSync: "2025-10-06 14:47",
      errorCount: 0,
      apiKeyMasked: "iot_••••••••••••7b3d",
    },
    {
      id: "3",
      name: "UNS/SCADA Interface",
      type: "Control Systems",
      status: "warning",
      lastSync: "2025-10-06 12:30",
      errorCount: 2,
      apiKeyMasked: "scada_••••••••••••9c1e",
    },
    {
      id: "4",
      name: "Branding Analytics",
      type: "Advertisement Tracking",
      status: "error",
      lastSync: "2025-10-05 08:15",
      errorCount: 12,
      apiKeyMasked: "brand_••••••••••••2f8a",
    },
  ]);

  // Mock audit trail
  const [auditEntries, setAuditEntries] = useState<AuditEntry[]>([
    {
      id: "1",
      action: "Rule Modified",
      actionType: "rule",
      user: "Admin User",
      timestamp: "2025-10-06 14:30",
      details: "Updated 'Fitness Certificate Validity' threshold to 24 hours",
    },
    {
      id: "2",
      action: "User Role Changed",
      actionType: "user",
      user: "System Admin",
      timestamp: "2025-10-06 11:15",
      details: "Changed Priya Menon role from Engineer to Planner",
    },
    {
      id: "3",
      action: "Integration Reconnected",
      actionType: "integration",
      user: "Admin User",
      timestamp: "2025-10-06 09:45",
      details: "Reconnected UNS/SCADA Interface after authentication error",
    },
    {
      id: "4",
      action: "User Deactivated",
      actionType: "user",
      user: "Admin User",
      timestamp: "2025-10-05 16:20",
      details: "Deactivated Suresh Babu due to role transfer",
    },
    {
      id: "5",
      action: "System Configuration",
      actionType: "system",
      user: "System",
      timestamp: "2025-10-05 08:00",
      details: "Automated backup completed successfully",
    },
  ]);

  // Handlers
  const handleAddRule = () => {
    setEditingRule(null);
    setIsRuleEditorOpen(true);
  };

  const handleEditRule = (rule: Rule) => {
    setEditingRule(rule);
    setIsRuleEditorOpen(true);
  };

  const handleDeleteRule = (ruleId: string) => {
    setRules(rules.filter((r) => r.id !== ruleId));
    
    const newEntry: AuditEntry = {
      id: Date.now().toString(),
      action: "Rule Deleted",
      actionType: "rule",
      user: "Admin User",
      timestamp: new Date().toLocaleString(),
      details: `Deleted rule ${rules.find((r) => r.id === ruleId)?.name}`,
    };
    setAuditEntries([newEntry, ...auditEntries]);
    
    toast.success("Rule deleted successfully");
  };

  const handleSaveRule = (ruleData: Partial<Rule>) => {
    if (ruleData.id) {
      // Update existing rule
      setRules(rules.map((r) => (r.id === ruleData.id ? { ...r, ...ruleData } as Rule : r)));
      toast.success("Rule updated successfully");
    } else {
      // Add new rule
      const newRule: Rule = {
        id: Date.now().toString(),
        ...ruleData,
      } as Rule;
      setRules([...rules, newRule]);
      toast.success("Rule created successfully");
    }

    const newEntry: AuditEntry = {
      id: Date.now().toString(),
      action: ruleData.id ? "Rule Modified" : "Rule Created",
      actionType: "rule",
      user: "Admin User",
      timestamp: new Date().toLocaleString(),
      details: `${ruleData.id ? "Updated" : "Created"} rule: ${ruleData.name}`,
    };
    setAuditEntries([newEntry, ...auditEntries]);
  };

  const handleToggleUserStatus = (userId: string) => {
    setUsers(
      users.map((u) =>
        u.id === userId ? { ...u, status: u.status === "active" ? "inactive" : "active" } : u
      )
    );

    const user = users.find((u) => u.id === userId);
    const newEntry: AuditEntry = {
      id: Date.now().toString(),
      action: "User Status Changed",
      actionType: "user",
      user: "Admin User",
      timestamp: new Date().toLocaleString(),
      details: `${user?.status === "active" ? "Deactivated" : "Activated"} user ${user?.name}`,
    };
    setAuditEntries([newEntry, ...auditEntries]);

    toast.success(`User ${user?.status === "active" ? "deactivated" : "activated"} successfully`);
  };

  const handleChangeUserRole = (userId: string, role: User["role"]) => {
    setUsers(users.map((u) => (u.id === userId ? { ...u, role } : u)));

    const user = users.find((u) => u.id === userId);
    const newEntry: AuditEntry = {
      id: Date.now().toString(),
      action: "User Role Changed",
      actionType: "user",
      user: "Admin User",
      timestamp: new Date().toLocaleString(),
      details: `Changed ${user?.name} role to ${role}`,
    };
    setAuditEntries([newEntry, ...auditEntries]);

    toast.success("User role updated successfully");
  };

  const handleAddUser = () => {
    toast.info("User creation modal would open here");
  };

  const handleReconnectIntegration = (id: string) => {
    setIntegrations(
      integrations.map((i) =>
        i.id === id
          ? { ...i, status: "connected", lastSync: new Date().toLocaleString(), errorCount: 0 }
          : i
      )
    );

    const integration = integrations.find((i) => i.id === id);
    const newEntry: AuditEntry = {
      id: Date.now().toString(),
      action: "Integration Reconnected",
      actionType: "integration",
      user: "Admin User",
      timestamp: new Date().toLocaleString(),
      details: `Reconnected ${integration?.name}`,
    };
    setAuditEntries([newEntry, ...auditEntries]);

    toast.success("Integration reconnected successfully");
  };

  const handleSaveChanges = () => {
    toast.success("All configuration changes saved");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div className="h-6 w-px bg-border" />
            <div>
              <h1 className="text-2xl font-bold">Admin & Configuration Console</h1>
              <p className="text-sm text-muted-foreground">
                Admin → Configuration Console
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsAuditDrawerOpen(true)}>
              <History className="h-4 w-4 mr-2" />
              Audit Trail
            </Button>
            <Button onClick={handleSaveChanges}>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="rules">Rules & Constraints</TabsTrigger>
            <TabsTrigger value="users">User Access</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
          </TabsList>

          <TabsContent value="rules" className="space-y-4">
            <RulesPanel
              rules={rules}
              onAddRule={handleAddRule}
              onEditRule={handleEditRule}
              onDeleteRule={handleDeleteRule}
            />
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <UserAccessTable
              users={users}
              onToggleStatus={handleToggleUserStatus}
              onChangeRole={handleChangeUserRole}
              onAddUser={handleAddUser}
            />
          </TabsContent>

          <TabsContent value="integrations" className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold mb-2">System Integrations</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Monitor and manage external system connections
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {integrations.map((integration) => (
                <IntegrationConfigCard
                  key={integration.id}
                  integration={integration}
                  onReconnect={handleReconnectIntegration}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Rule Editor Modal */}
      <RuleEditorModal
        open={isRuleEditorOpen}
        onOpenChange={setIsRuleEditorOpen}
        rule={editingRule}
        onSave={handleSaveRule}
      />

      {/* Audit Trail Drawer */}
      <AuditTrailDrawer
        open={isAuditDrawerOpen}
        onOpenChange={setIsAuditDrawerOpen}
        entries={auditEntries}
      />
    </div>
  );
}
